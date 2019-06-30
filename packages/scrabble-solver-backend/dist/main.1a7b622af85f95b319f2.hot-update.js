exports.id = "main";
exports.modules = {

/***/ "../scrabble-solver-commons/models/word-definition.js":
/*!************************************************************!*\
  !*** ../scrabble-solver-commons/models/word-definition.js ***!
  \************************************************************/
/*! exports provided: NullWordDefinition, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NullWordDefinition\", function() { return NullWordDefinition; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar WordDefinition =\n/*#__PURE__*/\nfunction () {\n  function WordDefinition(_ref) {\n    var definitions = _ref.definitions,\n        isAllowed = _ref.isAllowed,\n        word = _ref.word;\n\n    _classCallCheck(this, WordDefinition);\n\n    this.definitions = definitions;\n    this.isAllowed = isAllowed;\n    this.word = word;\n  }\n\n  _createClass(WordDefinition, [{\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        definitions: this.definitions,\n        isAllowed: this.isAllowed,\n        word: this.word\n      };\n    }\n  }]);\n\n  return WordDefinition;\n}();\n\nvar NullWordDefinition = Object.freeze({\n  definitions: [],\n  isAllowed: false,\n  word: ''\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (WordDefinition);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/word-definition.js?");

/***/ })

};