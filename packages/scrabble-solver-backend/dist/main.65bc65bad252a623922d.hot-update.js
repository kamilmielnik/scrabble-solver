exports.id = "main";
exports.modules = {

/***/ "../scrabble-solver-commons/models/tile.js":
/*!*************************************************!*\
  !*** ../scrabble-solver-commons/models/tile.js ***!
  \*************************************************/
/*! exports provided: NullTile, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NullTile\", function() { return NullTile; });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ \"../scrabble-solver-commons/constants/index.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Tile =\n/*#__PURE__*/\nfunction () {\n  function Tile(_ref) {\n    var character = _ref.character,\n        _ref$isBlank = _ref.isBlank,\n        isBlank = _ref$isBlank === void 0 ? false : _ref$isBlank;\n\n    _classCallCheck(this, Tile);\n\n    this.character = character;\n    this.isBlank = isBlank;\n  }\n\n  _createClass(Tile, [{\n    key: \"toString\",\n    value: function toString() {\n      return this.character;\n    }\n  }, {\n    key: \"toJson\",\n    value: function toJson() {\n      return {\n        character: this.character,\n        isBlank: this.isBlank\n      };\n    }\n  }, {\n    key: \"clone\",\n    value: function clone() {\n      return new Tile({\n        character: this.character,\n        isBlank: this.isBlank\n      });\n    }\n  }], [{\n    key: \"fromJson\",\n    value: function fromJson(json) {\n      if (!json) {\n        return NullTile;\n      }\n\n      return new Tile({\n        character: json.character,\n        isBlank: json.isBlank\n      });\n    }\n  }]);\n\n  return Tile;\n}();\n\nvar NullTile = Object.freeze({\n  character: _constants__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY_CELL\"],\n  isBlank: false,\n  toString: function toString() {\n    return _constants__WEBPACK_IMPORTED_MODULE_0__[\"EMPTY_CELL\"];\n  },\n  toJson: function toJson() {\n    return null;\n  },\n  clone: function clone() {\n    return NullTile;\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (Tile);\n\n//# sourceURL=webpack:///../scrabble-solver-commons/models/tile.js?");

/***/ })

};