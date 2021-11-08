/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/master.js":
/*!**************************!*\
  !*** ./src/js/master.js ***!
  \**************************/
/***/ (() => {

eval("function _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } else if (call !== void 0) { throw new TypeError(\"Derived constructors may only return object or undefined\"); } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Car = /*#__PURE__*/function () {\n  function Car(model, year) {\n    _classCallCheck(this, Car);\n\n    this.model = model;\n    this.year = year;\n  }\n\n  _createClass(Car, [{\n    key: \"getModel\",\n    value: function getModel() {\n      return this.model;\n    }\n  }]);\n\n  return Car;\n}();\n\nvar Opel = /*#__PURE__*/function (_Car) {\n  _inherits(Opel, _Car);\n\n  var _super = _createSuper(Opel);\n\n  function Opel(year, engine) {\n    var _this;\n\n    _classCallCheck(this, Opel);\n\n    _this = _super.call(this, \"Opel\", year);\n    _this.engine = engine;\n    return _this;\n  }\n\n  _createClass(Opel, [{\n    key: \"printEngine\",\n    value: function printEngine() {\n      console.log(this.engine);\n    }\n  }]);\n\n  return Opel;\n}(Car);\n\n$(document).ready(function () {\n  var HawkExamples = {};\n  HawkExamples.exemplaryDropdown = new Hawk.Dropdown($('#exemplary-dropdown'));\n  HawkExamples.exemplaryDropdown.run();\n  HawkExamples.expandingDropdown = new Hawk.Dropdown($('#expanding-dropdown'), {\n    type: Hawk.DropdownConstants.Types.EXPANDING\n  });\n  HawkExamples.expandingDropdown.run();\n  HawkExamples.layeredSection = new Hawk.LayeredSection($('#exemplary-layered-section'));\n  HawkExamples.layeredSection.run();\n  HawkExamples.moreContentManager = new Hawk.MoreContentManager(1, {});\n  HawkExamples.moreContentManager.run();\n  var HawkVariables = {};\n  HawkVariables.colorFieldsController = new Hawk.FieldController($('.colors-section input'), {\n    onChange: function onChange(field, value) {\n      console.log(field, value);\n      var label = field.parents('.form-field');\n      console.log(label);\n      label.find('.color-sample').css({\n        backgroundColor: value\n      });\n    }\n  });\n  HawkVariables.colorFieldsController.run(); // blabla\n});\n\n//# sourceURL=webpack://hawk-framework-v2/./src/js/master.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/master.js"]();
/******/ 	
/******/ })()
;