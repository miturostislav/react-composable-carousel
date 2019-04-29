'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.useCarouselDots = useCarouselDots;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _composableCarousel = require('composable-carousel');

var _composableCarousel2 = _interopRequireDefault(_composableCarousel);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var carousel = (0, _composableCarousel2.default)({
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
  return _react2.default.createElement(
    'div',
    { className: className, ref: carouselSelectorRef },
    children
  );
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
  className: _propTypes2.default.string,
  options: _propTypes2.default.objectOf(_propTypes2.default.any),
  onInit: _propTypes2.default.func,
  onResize: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  carouselRef: _propTypes2.default.objectOf(_propTypes2.default.object),
  children: _propTypes2.default.arrayOf(_propTypes2.default.element)
};

exports.default = Carousel;
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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = carouselMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var hookCallbacks = _step.value;

        for (var property in hookCallbacks) {
          callbacks[property].push(hookCallbacks[property]);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return callbacks;
}