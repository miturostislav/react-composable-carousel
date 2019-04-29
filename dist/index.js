"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCarouselDots = useCarouselDots;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _composableCarousel = _interopRequireDefault(require("composable-carousel"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var carouselsMap = new Map();

function Carousel(_ref) {
  var className = _ref.className,
      options = _ref.options,
      _onInit = _ref.onInit,
      onResize = _ref.onResize,
      _onChange = _ref.onChange,
      carouselRef = _ref.carouselRef,
      children = _ref.children;
  var carouselSelectorRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    var callbacks = getCallbacks(carouselRef);
    var carousel = (0, _composableCarousel["default"])({
      selector: carouselSelectorRef.current,
      options: options,
      onInit: function onInit() {
        callbacks.onInit.forEach(function (cb) {
          return cb();
        });

        _onInit();
      },
      onChange: function onChange() {
        callbacks.onChange.forEach(function (cb) {
          return cb();
        });

        _onChange();
      },
      onResize: onResize
    });
    carouselRef.current = carousel;
    carouselRef.current.selector = carouselSelectorRef.current;
    return function () {
      carousel.destroy();

      if (carouselRef) {
        carouselRef.current = null;
      }
    };
  }, [carouselRef, _onInit, onResize, options]);
  return _react["default"].createElement("div", {
    className: className,
    ref: carouselSelectorRef
  }, children);
}

Carousel.defaultProps = {
  className: '',
  options: null,
  onInit: function onInit() {},
  onResize: function onResize() {},
  onChange: function onChange() {},
  carouselRef: null,
  children: null
};
Carousel.propTypes = {
  className: _propTypes["default"].string,
  options: _propTypes["default"].objectOf(_propTypes["default"].any),
  onInit: _propTypes["default"].func,
  onResize: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  carouselRef: _propTypes["default"].objectOf(_propTypes["default"].object),
  children: _propTypes["default"].arrayOf(_propTypes["default"].element)
};
var _default = Carousel;
exports["default"] = _default;

function useCarouselDots(carouselRef) {
  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      nrOfDots = _useState2[0],
      setNrOfDots = _useState2[1];

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      activeDotIndex = _useState4[0],
      setActiveDotIndex = _useState4[1];

  useCarouselCallbacks(carouselRef, {
    onInit: function onInit() {
      return setNrOfDots(carouselRef.current.dots.getNrOfDots());
    },
    onChange: function onChange() {
      return setActiveDotIndex(carouselRef.current.dots.nrOfActiveDot());
    }
  });
  return {
    nrOfDots: nrOfDots,
    activeDotIndex: activeDotIndex,
    onDotClick: function onDotClick(index) {
      return carouselRef.current.dots.goToDot(index);
    }
  };
}

function useCarouselCallbacks(carouselRef, callbacks) {
  var hookRef = (0, _react.useRef)(null);

  if (!carouselsMap.get(carouselRef)) {
    carouselsMap.set(carouselRef, new Map());
  }

  carouselsMap.get(carouselRef).set(hookRef, callbacks);
}

function getCallbacks(carouselRef) {
  var callbacks = {
    onInit: [],
    onChange: []
  };
  var carouselMap = carouselsMap.get(carouselRef);

  if (carouselMap) {
    carouselMap.forEach(function (hookCallbacks) {
      for (var property in hookCallbacks) {
        callbacks[property].push(hookCallbacks[property]);
      }
    });
  }

  return callbacks;
}