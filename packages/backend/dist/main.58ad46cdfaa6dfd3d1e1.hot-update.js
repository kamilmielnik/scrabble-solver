exports.id = "main";
exports.modules = {

/***/ "./src/endpoints/search-en-dictionary.js":
/*!***********************************************!*\
  !*** ./src/endpoints/search-en-dictionary.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrabble-solver-commons/models */ \"../scrabble-solver-commons/models/index.js\");\n\n\nvar API_KEY = 'd0c21cb3cbc3415984a2a0486da075e54aa68091c33a680d9';\nvar MAX_RESULTS = 10;\nvar SOURCE_DICTIONARIES = 'all';\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (request, response) {\n  return getJson(getOptions(request.params.word)).then(function (results) {\n    var wordDefinition = new scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"WordDefinition\"]({\n      definitions: results.map(function (_ref) {\n        var text = _ref.text;\n        return text;\n      }),\n      isAllowed: results.length > 0,\n      word: request.params.word\n    });\n    response.send(wordDefinition.toJson());\n  })[\"catch\"](function () {\n    return response.send(scrabble_solver_commons_models__WEBPACK_IMPORTED_MODULE_1__[\"NullWordDefinition\"]);\n  });\n});\n\nvar getOptions = function getOptions(word) {\n  return {\n    hostname: 'api.wordnik.com',\n    path: getWordnikUrl(word),\n    headers: {\n      'Content-Type': 'application/json; charset=utf-8'\n    }\n  };\n};\n\nvar getWordnikUrl = function getWordnikUrl(word) {\n  return [\"/v4/word.json/\".concat(word, \"/definitions?\"), [\"api_key=\".concat(API_KEY), \"limit=\".concat(MAX_RESULTS), \"sourceDictionaries=\".concat(SOURCE_DICTIONARIES)].join('&')].join('');\n};\n\nvar getJson = function getJson(options) {\n  return new Promise(function (resolve, reject) {\n    return http__WEBPACK_IMPORTED_MODULE_0___default.a.get(options, function (response) {\n      var data = '';\n      response.setEncoding('utf8');\n      response.on('data', function (chunk) {\n        data += chunk;\n      });\n      response.on('end', function () {\n        resolve(JSON.parse(data));\n      });\n    }).on('error', reject);\n  });\n};\n\n//# sourceURL=webpack:///./src/endpoints/search-en-dictionary.js?");

/***/ })

};