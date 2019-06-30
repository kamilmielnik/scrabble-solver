exports.id = "main";
exports.modules = {

/***/ "./src/solver/scores-calculator.js":
/*!*****************************************!*\
  !*** ./src/solver/scores-calculator.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass ScoresCalculator {\n  constructor(config) {\n    this.config = config;\n  }\n\n  calculate(pattern) {\n    return this.calculatePatternsScore(pattern) + this.calculateBonusScore(pattern);\n  }\n\n  calculatePatternsScore(pattern) {\n    return pattern.getCollisions().reduce((patternsScore, collisionPattern) => patternsScore + this.calculatePatternScore(collisionPattern), this.calculatePatternScore(pattern));\n  }\n\n  calculateBonusScore(pattern) {\n    const areAllTilesUsed = pattern.getNumberOfEmptyCells() === this.config.maximumNumberOfCharacters;\n    return areAllTilesUsed ? this.config.allTilesBonusScore : 0;\n  }\n\n  calculatePatternScore(pattern) {\n    const {\n      multiplier,\n      score\n    } = pattern.cells.reduce((...params) => this.reduceCharacterScore(...params), {\n      multiplier: 1,\n      score: 0\n    });\n    return score * multiplier;\n  }\n\n  reduceCharacterScore({\n    multiplier,\n    score\n  }, cell) {\n    const {\n      tile: {\n        character,\n        isBlank\n      }\n    } = cell;\n    const {\n      wordMultiplier,\n      characterMultiplier\n    } = this.config.getCellBonusValue(cell);\n    const characterScore = isBlank ? this.config.blankScore : this.config.pointsMap[character];\n    return {\n      multiplier: multiplier * wordMultiplier,\n      score: score + characterScore * characterMultiplier\n    };\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ScoresCalculator);\n\n//# sourceURL=webpack:///./src/solver/scores-calculator.js?");

/***/ })

};