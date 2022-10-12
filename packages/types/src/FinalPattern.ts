import Pattern from './Pattern';

class FinalPattern extends Pattern {
  private readonly collisions: Pattern[];

  constructor(pattern: Pattern) {
    super(pattern.board, pattern.cells);
    this.collisions = pattern.getCollisions();
  }

  public getCollisions(): Pattern[] {
    return this.collisions;
  }
}

export default FinalPattern;
