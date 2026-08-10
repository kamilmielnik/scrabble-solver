/* eslint-disable max-depth, max-lines, max-statements, no-bitwise */
import { type Gaddag, LAST_ARC_FLAG, LETTER_MASK, SEPARATOR } from '@kamilmielnik/gaddag';
import { BONUS_CHARACTER, BONUS_WORD } from '@scrabble-solver/constants';
import {
  type Board,
  type Config,
  type ResultJson,
  type Tile,
  isMultiplierBingo,
  isScoreBingo,
} from '@scrabble-solver/types';

const MAX_ALPHABET_SIZE = 64;

// The result sort key packs (direction, line, start, end) into one integer.
const MAX_BOARD_DIMENSION = 32;

/**
 * Anchor-based move generation over a {@link Gaddag} (Gordon, 1994).
 *
 * For every anchor (an empty cell adjacent to a tile, or the board center when
 * the board is empty) the generator extends leftwards from the anchor through
 * the reversed-prefix part of the GADDAG, crosses the separator, and extends
 * rightwards — validating perpendicular words with precomputed cross-check
 * masks. Both directions run the same code path: the vertical pass remaps
 * (line, position) to transposed coordinates. Each placement is scored and
 * emitted as a compact {@link ResultJson} — placed tiles plus placement — from
 * which {@link Result.fromJson} rebuilds the full cells and collisions against
 * the board.
 */
export class MoveGenerator {
  private readonly gaddag: Gaddag;
  private readonly config: Config;

  private readonly width: number;
  private readonly height: number;
  private readonly cellsCount: number;

  // Config alphabet (tile characters, including two-character tiles).
  private readonly alphaSize: number;
  private readonly alphaChars: string[];
  private readonly alphaLetter1: Int32Array;
  private readonly alphaLetter2: Int32Array;
  private readonly alphaPoints: Int32Array;

  // CSR mapping from a GADDAG letter to the alphabet entries whose leading
  // letter (in traversal order) is that letter. Moving leftwards reads a
  // tile's characters reversed, so a two-character tile leads with its second
  // letter. alphaSecond* hold the remaining letter to consume (0 if none).
  private readonly leftAlphaStart: Int32Array;
  private readonly leftAlphaList: Int32Array;
  private readonly rightAlphaStart: Int32Array;
  private readonly rightAlphaList: Int32Array;
  private readonly alphaSecondLeft: Int32Array;
  private readonly alphaSecondRight: Int32Array;

  // Rack.
  private readonly rackCounts: Int32Array;
  private blanksLeft = 0;
  private rackTotal = 0;

  // Bonuses indexed by global cell index (y * width + x). Types: 0 none, 1 character, 2 word.
  private readonly bonusType: Uint8Array;
  private readonly bonusMult: Int32Array;
  private readonly bonusReq: Int32Array;

  // Board indexed by global cell index.
  private readonly boardFilled: Uint8Array;
  private readonly boardChar: string[];
  private readonly boardIsBlank: Uint8Array;
  private readonly boardScore: Int32Array;
  private readonly boardLetter1: Int32Array;
  private readonly boardLetter2: Int32Array;
  private readonly anchor: Uint8Array;
  private boardIsEmpty = true;

  // Current pass (direction) data, indexed by line * lineLength + position.
  private isHorizontal = true;
  private lineLength = 0;
  private linesCount = 0;
  private readonly passFilled: Uint8Array;
  private readonly passLetter1: Int32Array;
  private readonly passLetter2: Int32Array;
  private readonly passScore: Int32Array;
  private readonly passGlobal: Int32Array;
  private readonly passAnchor: Uint8Array;
  private readonly maskLo: Int32Array;
  private readonly maskHi: Int32Array;
  private readonly crossBase: Int32Array;
  private readonly hasCross: Uint8Array;

  // Current line/anchor state.
  private line = 0;
  private lineBase = 0;
  private anchorPos = 0;
  private limit = 0;
  private anchorRightOpen = false;
  private leftMost = 0;

  // Placement stack (indexed by position within the current line).
  private readonly placedAt: Int32Array;
  private readonly placedBlankAt: Uint8Array;
  private placedCount = 0;

  private readonly digraphs: string[];
  private readonly blankScore: number;
  private readonly rackSize: number;

  // Single-tile placements are the only ones both passes can emit; multi-tile
  // placements determine their line, span, and anchor uniquely.
  private readonly seenSingleTiles = new Set<number>();
  private readonly results: ResultJson[] = [];

  // Board cells are immutable during a solve, so their JSON is shared between results.

  // Sort keys reproducing the previous solver's result order:
  // horizontal before vertical, then by line, start, and end position.
  private readonly sortKeys: number[] = [];

  // Secondary sort keys resolving ties within the same word span: the
  // previous solver filled cells left to right, trying rack tiles in their
  // original order (and, for blanks, alphabet characters in config order).
  private readonly rankKeys: string[] = [];
  private readonly alphaFirstRackIndex: Int32Array;
  private blankRackIndex = 0;

  constructor(gaddag: Gaddag, config: Config, board: Board, tiles: Tile[]) {
    this.gaddag = gaddag;
    this.config = config;
    this.width = board.columnsCount;
    this.height = board.rowsCount;
    this.cellsCount = this.width * this.height;
    this.blankScore = config.blankScore;
    this.rackSize = config.rackSize;
    this.digraphs = config.twoCharacterTiles;

    const alphabet = config.alphabet;

    if (alphabet.length > MAX_ALPHABET_SIZE) {
      throw new Error(`Alphabets larger than ${MAX_ALPHABET_SIZE} tiles are not supported`);
    }

    if (this.width > MAX_BOARD_DIMENSION || this.height > MAX_BOARD_DIMENSION) {
      throw new Error(`Boards larger than ${MAX_BOARD_DIMENSION}x${MAX_BOARD_DIMENSION} are not supported`);
    }

    this.alphaSize = alphabet.length;
    this.alphaChars = alphabet;
    this.alphaLetter1 = new Int32Array(this.alphaSize);
    this.alphaLetter2 = new Int32Array(this.alphaSize);
    this.alphaPoints = new Int32Array(this.alphaSize);

    for (let index = 0; index < this.alphaSize; ++index) {
      const character = alphabet[index];
      this.alphaLetter1[index] = gaddag.getLetter(character.charCodeAt(0));
      this.alphaLetter2[index] = character.length > 1 ? gaddag.getLetter(character.charCodeAt(1)) : 0;
      this.alphaPoints[index] = config.pointsMap[character] || 0;
    }

    const lettersCount = MAX_ALPHABET_SIZE;
    this.leftAlphaStart = new Int32Array(lettersCount + 1);
    this.rightAlphaStart = new Int32Array(lettersCount + 1);
    this.leftAlphaList = new Int32Array(this.alphaSize);
    this.rightAlphaList = new Int32Array(this.alphaSize);
    this.alphaSecondLeft = new Int32Array(this.alphaSize);
    this.alphaSecondRight = new Int32Array(this.alphaSize);

    for (let pass = 0; pass < 2; ++pass) {
      for (let index = 0; index < this.alphaSize; ++index) {
        const letter1 = this.alphaLetter1[index];
        const letter2 = this.alphaLetter2[index];

        if (letter1 <= 0 || letter2 < 0) {
          continue;
        }

        const leftLead = letter2 === 0 ? letter1 : letter2;

        if (pass === 0) {
          ++this.leftAlphaStart[leftLead + 1];
          ++this.rightAlphaStart[letter1 + 1];
        } else {
          this.leftAlphaList[this.leftAlphaStart[leftLead]++] = index;
          this.rightAlphaList[this.rightAlphaStart[letter1]++] = index;
          this.alphaSecondLeft[index] = letter2 === 0 ? 0 : letter1;
          this.alphaSecondRight[index] = letter2;
        }
      }

      if (pass === 0) {
        for (let letter = 0; letter < lettersCount; ++letter) {
          this.leftAlphaStart[letter + 1] += this.leftAlphaStart[letter];
          this.rightAlphaStart[letter + 1] += this.rightAlphaStart[letter];
        }
      }
    }

    // The second pass advanced the start offsets by each bucket's size; shift them back.
    for (let letter = lettersCount; letter > 0; --letter) {
      this.leftAlphaStart[letter] = this.leftAlphaStart[letter - 1];
      this.rightAlphaStart[letter] = this.rightAlphaStart[letter - 1];
    }

    this.leftAlphaStart[0] = 0;
    this.rightAlphaStart[0] = 0;

    this.rackCounts = new Int32Array(this.alphaSize);
    this.alphaFirstRackIndex = new Int32Array(this.alphaSize).fill(tiles.length);
    this.blankRackIndex = tiles.length;

    for (let tileIndex = 0; tileIndex < tiles.length; ++tileIndex) {
      const tile = tiles[tileIndex];

      if (tile.isBlank) {
        if (this.blanksLeft === 0) {
          this.blankRackIndex = tileIndex;
        }

        ++this.blanksLeft;
        ++this.rackTotal;
        continue;
      }

      const alphaIndex = alphabet.indexOf(tile.character);

      if (alphaIndex !== -1) {
        if (this.rackCounts[alphaIndex] === 0) {
          this.alphaFirstRackIndex[alphaIndex] = tileIndex;
        }

        ++this.rackCounts[alphaIndex];
        ++this.rackTotal;
      }
    }

    this.bonusType = new Uint8Array(this.cellsCount);
    this.bonusMult = new Int32Array(this.cellsCount);
    this.bonusReq = new Int32Array(this.cellsCount).fill(-1);

    // Iterate backwards so the first matching bonus wins, mirroring config.getCellBonus.
    for (let index = config.bonuses.length - 1; index >= 0; --index) {
      const bonus = config.bonuses[index];

      if (bonus.x < 0 || bonus.x >= this.width || bonus.y < 0 || bonus.y >= this.height) {
        continue;
      }

      const cellIndex = bonus.y * this.width + bonus.x;

      if (bonus.type === BONUS_CHARACTER) {
        this.bonusType[cellIndex] = 1;
      } else if (bonus.type === BONUS_WORD) {
        this.bonusType[cellIndex] = 2;
      } else {
        this.bonusType[cellIndex] = 0;
      }

      this.bonusMult[cellIndex] = bonus.multiplier;
      this.bonusReq[cellIndex] = typeof bonus.score === 'number' ? bonus.score : -1;
    }

    this.boardFilled = new Uint8Array(this.cellsCount);
    this.boardChar = Array.from<string>({ length: this.cellsCount });
    this.boardIsBlank = new Uint8Array(this.cellsCount);
    this.boardScore = new Int32Array(this.cellsCount);
    this.boardLetter1 = new Int32Array(this.cellsCount);
    this.boardLetter2 = new Int32Array(this.cellsCount);
    this.anchor = new Uint8Array(this.cellsCount);

    for (let y = 0; y < this.height; ++y) {
      const row = board.rows[y];

      for (let x = 0; x < this.width; ++x) {
        const cell = row[x];

        if (!cell.isFilled()) {
          continue;
        }

        const cellIndex = y * this.width + x;
        const character = cell.tile.character;
        this.boardIsEmpty = false;
        this.boardFilled[cellIndex] = 1;
        this.boardChar[cellIndex] = character;
        this.boardIsBlank[cellIndex] = cell.tile.isBlank ? 1 : 0;
        this.boardScore[cellIndex] = cell.tile.isBlank ? this.blankScore : config.pointsMap[character] || 0;
        this.boardLetter1[cellIndex] = gaddag.getLetter(character.charCodeAt(0));
        this.boardLetter2[cellIndex] = character.length > 1 ? gaddag.getLetter(character.charCodeAt(1)) : 0;
      }
    }

    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const cellIndex = y * this.width + x;

        if (this.boardFilled[cellIndex] === 1) {
          continue;
        }

        const up = y > 0 && this.boardFilled[cellIndex - this.width] === 1;
        const down = y < this.height - 1 && this.boardFilled[cellIndex + this.width] === 1;
        const left = x > 0 && this.boardFilled[cellIndex - 1] === 1;
        const right = x < this.width - 1 && this.boardFilled[cellIndex + 1] === 1;
        this.anchor[cellIndex] = up || down || left || right ? 1 : 0;
      }
    }

    this.passFilled = new Uint8Array(this.cellsCount);
    this.passLetter1 = new Int32Array(this.cellsCount);
    this.passLetter2 = new Int32Array(this.cellsCount);
    this.passScore = new Int32Array(this.cellsCount);
    this.passGlobal = new Int32Array(this.cellsCount);
    this.passAnchor = new Uint8Array(this.cellsCount);
    this.maskLo = new Int32Array(this.cellsCount);
    this.maskHi = new Int32Array(this.cellsCount);
    this.crossBase = new Int32Array(this.cellsCount);
    this.hasCross = new Uint8Array(this.cellsCount);
    const maxLineLength = Math.max(this.width, this.height);
    this.placedAt = new Int32Array(maxLineLength).fill(-1);
    this.placedBlankAt = new Uint8Array(maxLineLength);
  }

  public run(): ResultJson[] {
    if (this.rackTotal === 0) {
      return this.results;
    }

    this.runPass(true);
    this.runPass(false);

    // Reorder results to match the previous solver's enumeration order, so
    // that ties (equal points) resolve to the same result in the UI.
    const order = this.results.map((_, index) => index);
    const { rankKeys, sortKeys } = this;
    order.sort((a, b) => {
      const difference = sortKeys[a] - sortKeys[b];

      if (difference !== 0) {
        return difference;
      }

      const rankA = rankKeys[a];
      const rankB = rankKeys[b];

      if (rankA < rankB) {
        return -1;
      }

      return rankA > rankB ? 1 : 0;
    });

    return order.map((resultIndex, index) => {
      const result = this.results[resultIndex];
      result.id = index;
      return result;
    });
  }

  private runPass(horizontal: boolean): void {
    this.isHorizontal = horizontal;
    this.linesCount = horizontal ? this.height : this.width;
    this.lineLength = horizontal ? this.width : this.height;
    this.setupPass();

    const centerLine = horizontal ? Math.floor(this.height / 2) : Math.floor(this.width / 2);
    const centerPos = horizontal ? Math.floor(this.width / 2) : Math.floor(this.height / 2);

    for (let line = 0; line < this.linesCount; ++line) {
      this.line = line;
      this.lineBase = line * this.lineLength;

      for (let position = 0; position < this.lineLength; ++position) {
        const isAnchor = this.boardIsEmpty
          ? line === centerLine && position === centerPos
          : this.passAnchor[this.lineBase + position] === 1;

        if (!isAnchor) {
          continue;
        }

        this.anchorPos = position;
        this.anchorRightOpen = position + 1 >= this.lineLength || this.passFilled[this.lineBase + position + 1] === 0;

        let limit = 0;
        const maxLimit = this.rackTotal - 1;

        for (let left = position - 1; left >= 0 && limit < maxLimit; --left) {
          const index = this.lineBase + left;

          if (this.passFilled[index] === 1 || (!this.boardIsEmpty && this.passAnchor[index] === 1)) {
            break;
          }

          ++limit;
        }

        this.limit = limit;
        this.generateLeft(position, this.gaddag.rootRef);
      }
    }
  }

  private setupPass(): void {
    const { lineLength, linesCount } = this;

    for (let line = 0; line < linesCount; ++line) {
      const base = line * lineLength;

      for (let position = 0; position < lineLength; ++position) {
        const passIndex = base + position;
        const globalIndex = this.isHorizontal ? passIndex : position * this.width + line;
        this.passGlobal[passIndex] = globalIndex;
        this.passFilled[passIndex] = this.boardFilled[globalIndex];
        this.passLetter1[passIndex] = this.boardLetter1[globalIndex];
        this.passLetter2[passIndex] = this.boardLetter2[globalIndex];
        this.passScore[passIndex] = this.boardScore[globalIndex];
        this.passAnchor[passIndex] = this.anchor[globalIndex];
      }
    }

    this.computeCrossChecks();
  }

  /**
   * For every empty cell with perpendicular neighbors, computes the set of
   * placeable tile characters (as a 64-bit mask), the sum of the existing
   * perpendicular tiles' scores, and the perpendicular word span.
   */
  private computeCrossChecks(): void {
    const { gaddag, lineLength, linesCount } = this;
    const preLetters: number[] = [];
    const postLetters: number[] = [];

    for (let line = 0; line < linesCount; ++line) {
      for (let position = 0; position < lineLength; ++position) {
        const passIndex = line * lineLength + position;

        if (this.passFilled[passIndex] === 1) {
          continue;
        }

        const upFilled = line > 0 && this.passFilled[passIndex - lineLength] === 1;
        const downFilled = line < linesCount - 1 && this.passFilled[passIndex + lineLength] === 1;

        if (!upFilled && !downFilled) {
          this.maskLo[passIndex] = -1;
          this.maskHi[passIndex] = -1;
          this.hasCross[passIndex] = 0;
          continue;
        }

        let spanLo = line;

        while (spanLo > 0 && this.passFilled[(spanLo - 1) * lineLength + position] === 1) {
          --spanLo;
        }

        let spanHi = line;

        while (spanHi < linesCount - 1 && this.passFilled[(spanHi + 1) * lineLength + position] === 1) {
          ++spanHi;
        }

        const hasDigraphs = this.digraphs.length > 0;
        const previousCharacter =
          hasDigraphs && spanLo < line ? this.boardChar[this.passGlobal[passIndex - lineLength]] : '';
        const nextCharacter =
          hasDigraphs && spanHi > line ? this.boardChar[this.passGlobal[passIndex + lineLength]] : '';

        preLetters.length = 0;
        postLetters.length = 0;
        let base = 0;
        let lettersValid = true;
        let crossSpellingValid = true;
        let previousCrossCharacter = '';

        for (let crossLine = spanLo; crossLine <= spanHi; ++crossLine) {
          if (crossLine === line) {
            continue;
          }

          const crossIndex = crossLine * lineLength + position;
          base += this.passScore[crossIndex];

          if (hasDigraphs) {
            const character = this.boardChar[this.passGlobal[crossIndex]];

            if (previousCrossCharacter !== '' && this.digraphs.includes(previousCrossCharacter + character)) {
              crossSpellingValid = false;
            }

            previousCrossCharacter = crossLine === line - 1 ? '' : character;
          }

          const letters = crossLine < line ? preLetters : postLetters;
          const letter1 = this.passLetter1[crossIndex];
          const letter2 = this.passLetter2[crossIndex];

          if (letter1 <= 0 || letter2 < 0) {
            lettersValid = false;
          }

          letters.push(letter1);

          if (letter2 !== 0) {
            letters.push(letter2);
          }
        }

        this.hasCross[passIndex] = 1;
        this.crossBase[passIndex] = base;

        let maskLo = 0;
        let maskHi = 0;

        if (lettersValid && crossSpellingValid) {
          // The perpendicular word is pre + tile + post; its pure-reverse GADDAG
          // path is rev(post), rev(tile characters), rev(pre). rev(post) is shared
          // across all candidate tiles.
          let postRef = gaddag.rootRef;

          for (let index = postLetters.length - 1; index >= 0 && postRef !== 0; --index) {
            postRef = gaddag.getArc(postRef, postLetters[index]);
          }

          if (postRef !== 0) {
            for (let alpha = 0; alpha < this.alphaSize; ++alpha) {
              const letter1 = this.alphaLetter1[alpha];
              const letter2 = this.alphaLetter2[alpha];

              if (letter1 <= 0 || letter2 < 0) {
                continue;
              }

              if (hasDigraphs && this.spellsDigraphWithNeighbor(alpha, previousCharacter, nextCharacter)) {
                continue;
              }

              let ref = postRef;

              if (letter2 !== 0) {
                ref = gaddag.getArc(ref, letter2);

                if (ref === 0) {
                  continue;
                }
              }

              ref = gaddag.getArc(ref, letter1);

              for (let index = preLetters.length - 1; index >= 0 && ref !== 0; --index) {
                ref = gaddag.getArc(ref, preLetters[index]);
              }

              if ((ref & 1) === 1) {
                if (alpha < 32) {
                  maskLo |= 1 << alpha;
                } else {
                  maskHi |= 1 << (alpha - 32);
                }
              }
            }
          }
        }

        this.maskLo[passIndex] = maskLo;
        this.maskHi[passIndex] = maskHi;
      }
    }
  }

  /**
   * A digraph must be played as its single tile, so a candidate that would
   * spell a digraph with the adjacent perpendicular tile is not placeable.
   * {@link record} enforces the same rule along the main word.
   */
  private spellsDigraphWithNeighbor(alpha: number, previousCharacter: string, nextCharacter: string): boolean {
    const character = this.alphaChars[alpha];

    return (
      (previousCharacter !== '' && this.digraphs.includes(previousCharacter + character)) ||
      (nextCharacter !== '' && this.digraphs.includes(character + nextCharacter))
    );
  }

  private isOpen(position: number): boolean {
    return position < 0 || position >= this.lineLength || this.passFilled[this.lineBase + position] === 0;
  }

  private generateLeft(position: number, ref: number): void {
    const { gaddag, lineBase } = this;
    const inBounds = position >= 0;
    const passIndex = lineBase + position;

    if (inBounds && this.passFilled[passIndex] === 1) {
      // Read an existing tile (reversed character order when moving left).
      const letter2 = this.passLetter2[passIndex];
      let nextRef = ref;

      if (letter2 !== 0) {
        nextRef = letter2 > 0 ? gaddag.getArc(nextRef, letter2) : 0;

        if (nextRef === 0) {
          return;
        }
      }

      const letter1 = this.passLetter1[passIndex];
      nextRef = letter1 > 0 ? gaddag.getArc(nextRef, letter1) : 0;

      if (nextRef === 0) {
        return;
      }

      this.recordLeftIfWord(nextRef, position);
      this.generateLeft(position - 1, nextRef);
      return;
    }

    // The cell at `position` is empty or off-board, so the left part may stop here.
    const separatorRef = gaddag.getArc(ref, SEPARATOR);

    if (separatorRef !== 0) {
      this.leftMost = position + 1;
      this.generateRight(this.anchorPos + 1, separatorRef);
    }

    if (!inBounds || (position !== this.anchorPos && this.anchorPos - position > this.limit)) {
      return;
    }

    this.placeAt(position, passIndex, ref, true);
  }

  private generateRight(position: number, ref: number): void {
    const { gaddag, lineBase } = this;
    const inBounds = position < this.lineLength;
    const passIndex = lineBase + position;

    if (inBounds && this.passFilled[passIndex] === 1) {
      const letter1 = this.passLetter1[passIndex];
      let nextRef = letter1 > 0 ? gaddag.getArc(ref, letter1) : 0;

      if (nextRef === 0) {
        return;
      }

      const letter2 = this.passLetter2[passIndex];

      if (letter2 !== 0) {
        nextRef = letter2 > 0 ? gaddag.getArc(nextRef, letter2) : 0;

        if (nextRef === 0) {
          return;
        }
      }

      if ((nextRef & 1) === 1 && this.isOpen(position + 1)) {
        this.record(this.leftMost, position);
      }

      this.generateRight(position + 1, nextRef);
      return;
    }

    if (!inBounds) {
      return;
    }

    this.placeAt(position, passIndex, ref, false);
  }

  /**
   * Tries every rack tile (and blank interpretation) at an empty cell,
   * recursing further. Iterates the state's arcs instead of the alphabet:
   * deep GADDAG states have very few arcs, so this is much cheaper than
   * probing every letter.
   */
  private placeAt(position: number, passIndex: number, ref: number, leftward: boolean): void {
    let arcIndex = ref >>> 1;

    if (arcIndex === 0 || this.placedCount >= this.rackTotal) {
      return;
    }

    const maskLo = this.maskLo[passIndex];
    const maskHi = this.maskHi[passIndex];

    if (maskLo === 0 && maskHi === 0) {
      return;
    }

    const { gaddag } = this;
    const labels = gaddag.arcLabels;
    const targets = gaddag.arcTargets;
    const alphaStart = leftward ? this.leftAlphaStart : this.rightAlphaStart;
    const alphaList = leftward ? this.leftAlphaList : this.rightAlphaList;
    const alphaSecond = leftward ? this.alphaSecondLeft : this.alphaSecondRight;
    // Restored by every recursive call, so stable across loop iterations.
    const hasBlank = this.blanksLeft > 0;

    for (;;) {
      const label = labels[arcIndex];
      const letter = label & LETTER_MASK;

      if (letter !== SEPARATOR) {
        const target = targets[arcIndex];
        const alphasEnd = alphaStart[letter + 1];

        for (let alphaIndex = alphaStart[letter]; alphaIndex < alphasEnd; ++alphaIndex) {
          const alpha = alphaList[alphaIndex];
          const hasTile = this.rackCounts[alpha] > 0;

          if (!hasTile && !hasBlank) {
            continue;
          }

          const allowed = alpha < 32 ? (maskLo & (1 << alpha)) !== 0 : (maskHi & (1 << (alpha - 32))) !== 0;

          if (!allowed) {
            continue;
          }

          const second = alphaSecond[alpha];
          const nextRef = second === 0 ? target : gaddag.getArc(target, second);

          if (nextRef === 0) {
            continue;
          }

          if (hasTile) {
            --this.rackCounts[alpha];
            this.pushPlacement(position, alpha, false);
            this.afterPlacement(position, nextRef, leftward);
            this.popPlacement(position);
            ++this.rackCounts[alpha];
          }

          if (hasBlank) {
            --this.blanksLeft;
            this.pushPlacement(position, alpha, true);
            this.afterPlacement(position, nextRef, leftward);
            this.popPlacement(position);
            ++this.blanksLeft;
          }
        }
      }

      if (label >= LAST_ARC_FLAG) {
        return;
      }

      ++arcIndex;
    }
  }

  private pushPlacement(position: number, alpha: number, isBlank: boolean): void {
    this.placedAt[position] = alpha;
    this.placedBlankAt[position] = isBlank ? 1 : 0;
    ++this.placedCount;
  }

  private popPlacement(position: number): void {
    this.placedAt[position] = -1;
    --this.placedCount;
  }

  private afterPlacement(position: number, ref: number, leftward: boolean): void {
    if (leftward) {
      this.recordLeftIfWord(ref, position);
      this.generateLeft(position - 1, ref);
    } else {
      if ((ref & 1) === 1 && this.isOpen(position + 1)) {
        this.record(this.leftMost, position);
      }

      this.generateRight(position + 1, ref);
    }
  }

  /**
   * Records a word that ends at the anchor (a pure reversed-word GADDAG path).
   * Words spanning a single cell are skipped: a lone tile's word is the
   * perpendicular one, generated by the other pass.
   */
  private recordLeftIfWord(ref: number, position: number): void {
    if ((ref & 1) === 1 && this.anchorRightOpen && position < this.anchorPos && this.isOpen(position - 1)) {
      this.record(position, this.anchorPos);
    }
  }

  private record(startPosition: number, endPosition: number): void {
    const { lineBase } = this;

    if (this.digraphs.length > 0 && this.hasInvalidDigraph(startPosition, endPosition)) {
      return;
    }

    if (this.placedCount === 1) {
      let placedPosition = startPosition;

      while (this.passFilled[lineBase + placedPosition] === 1) {
        ++placedPosition;
      }

      const key =
        this.passGlobal[lineBase + placedPosition] * 128 +
        this.placedAt[placedPosition] * 2 +
        this.placedBlankAt[placedPosition];

      if (this.seenSingleTiles.has(key)) {
        return;
      }

      this.seenSingleTiles.add(key);
    }

    // Score and emit ResultJson in a single pass.
    let mainScore = 0;
    let wordMultiplier = 1;
    let collisionsScore = 0;
    const tiles: string[] = [];
    const blankIndices: number[] = [];

    for (let position = startPosition; position <= endPosition; ++position) {
      const passIndex = lineBase + position;

      if (this.passFilled[passIndex] === 1) {
        mainScore += this.passScore[passIndex];
        continue;
      }

      const globalIndex = this.passGlobal[passIndex];
      const alpha = this.placedAt[position];
      const isBlank = this.placedBlankAt[position] === 1;
      const tileScore = isBlank ? this.blankScore : this.alphaPoints[alpha];
      let characterMultiplier = 1;
      let cellWordMultiplier = 1;
      const bonusType = this.bonusType[globalIndex];

      if (bonusType === 1) {
        const requirement = this.bonusReq[globalIndex];

        if (requirement === -1 || requirement === this.alphaPoints[alpha]) {
          characterMultiplier = this.bonusMult[globalIndex];
        }
      } else if (bonusType === 2) {
        cellWordMultiplier = this.bonusMult[globalIndex];
      }

      mainScore += tileScore * characterMultiplier;
      wordMultiplier *= cellWordMultiplier;

      if (isBlank) {
        blankIndices.push(tiles.length);
      }

      tiles.push(this.alphaChars[alpha]);

      if (this.hasCross[passIndex] === 1) {
        collisionsScore += (this.crossBase[passIndex] + tileScore * characterMultiplier) * cellWordMultiplier;
      }
    }

    let points = mainScore * wordMultiplier + collisionsScore;

    if (this.placedCount === this.rackSize) {
      const bingo = this.config.bingo;

      if (isScoreBingo(bingo)) {
        points += bingo.score;
      } else if (isMultiplierBingo(bingo)) {
        points = mainScore * wordMultiplier * bingo.multiplier + collisionsScore;
      }
    }

    let rankKey = '';

    for (let position = startPosition; position <= endPosition; ++position) {
      if (this.passFilled[lineBase + position] === 0) {
        const alpha = this.placedAt[position];
        const isBlank = this.placedBlankAt[position] === 1;
        const rackIndex = isBlank ? this.blankRackIndex : this.alphaFirstRackIndex[alpha];
        rankKey += String.fromCharCode(rackIndex * 64 + (isBlank ? alpha : 0));
      }
    }

    this.sortKeys.push((this.isHorizontal ? 0 : 1 << 20) | (this.line << 15) | (startPosition << 8) | endPosition);
    this.rankKeys.push(rankKey);
    this.results.push({
      blankIndices,
      id: this.results.length,
      isHorizontal: this.isHorizontal,
      points,
      tiles,
      x: this.isHorizontal ? startPosition : this.line,
      y: this.isHorizontal ? this.line : startPosition,
    });
  }

  private hasInvalidDigraph(startPosition: number, endPosition: number): boolean {
    let previousCharacter = this.characterAt(startPosition);

    for (let position = startPosition + 1; position <= endPosition; ++position) {
      const character = this.characterAt(position);

      if (this.digraphs.includes(previousCharacter + character)) {
        return true;
      }

      previousCharacter = character;
    }

    return false;
  }

  private characterAt(position: number): string {
    const passIndex = this.lineBase + position;

    if (this.passFilled[passIndex] === 1) {
      return this.boardChar[this.passGlobal[passIndex]];
    }

    return this.alphaChars[this.placedAt[position]];
  }
}
