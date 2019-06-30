exports.id = "main";
exports.modules = {

/***/ "./src/solver/patterns-generator.js":
/*!******************************************!*\
  !*** ./src/solver/patterns-generator.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\n\n\nclass PatternsGenerator {\n  constructor(config) {\n    this.config = config;\n  }\n\n  generate(board) {\n    return {\n      horizontal: this.generatePatterns({\n        board,\n        Pattern: scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__[\"HorizontalPattern\"],\n        numberOfVectors: this.config.boardHeight,\n        getNthVector: index => board.getRow(index)\n      }),\n      vertical: this.generatePatterns({\n        board,\n        Pattern: scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_0__[\"VerticalPattern\"],\n        numberOfVectors: this.config.boardWidth,\n        getNthVector: index => board.getColumn(index)\n      })\n    };\n  }\n\n  generatePatterns({\n    board,\n    Pattern,\n    getNthVector,\n    numberOfVectors\n  }) {\n    return this.generateVectors({\n      getNthVector,\n      numberOfVectors\n    }).reduce((patterns, cells) => patterns.concat(this.generateCellsPatterns({\n      board,\n      Pattern,\n      cells\n    })), []);\n  }\n\n  generateVectors({\n    getNthVector,\n    numberOfVectors\n  }) {\n    return Array(numberOfVectors).fill(0).map((_, index) => getNthVector(index));\n  }\n\n  generateCellsPatterns({\n    board,\n    Pattern,\n    cells\n  }) {\n    return this.generateStartIndices({\n      cells\n    }).reduce((patterns, startIndex) => patterns.concat(this.generateEndIndices({\n      cells,\n      startIndex\n    }).reduce((placeablePatterns, endIndex) => {\n      const pattern = new Pattern({\n        board,\n        cells: cells.slice(startIndex, endIndex + 1)\n      });\n\n      if (pattern.canBePlaced()) {\n        placeablePatterns.push(pattern);\n      }\n\n      return placeablePatterns;\n    }, [])), []);\n  }\n\n  generateStartIndices({\n    cells\n  }) {\n    return Array(cells.length - 1).fill(0).map((_, startIndex) => startIndex).filter(startIndex => startIndex === 0 || !cells[startIndex - 1].hasTile());\n  }\n\n  generateEndIndices({\n    cells,\n    startIndex\n  }) {\n    return Array(cells.length - startIndex - 1).fill(0).map((_, endIndex) => endIndex + startIndex + 1).filter(endIndex => endIndex >= cells.length - 1 || !cells[endIndex + 1].hasTile());\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (PatternsGenerator);\n\n//# sourceURL=webpack:///./src/solver/patterns-generator.js?");

/***/ })

};