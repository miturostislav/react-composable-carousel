import React, { useEffect, useRef, useState } from 'react';
import createCarousel from 'composable-carousel';
import PropTypes from 'prop-types';

const carouselsMap = new Map();

function Carousel({
  className,
  options,
  onInit,
  onResize,
  onChange,
  carouselRef,
  children
}) {
  const carouselSelectorRef = useRef(null);

  useEffect(() => {
    const callbacks = getCallbacks(carouselRef);
    const carousel = createCarousel({
      selector: carouselSelectorRef.current,
      options,
      onInit() {
        callbacks.onInit.forEach(cb => cb());
        onInit();
      },
      onChange() {
        callbacks.onChange.forEach(cb => cb());
        onChange();
      },
      onResize
    });
    carouselRef.current = carousel;
    carouselRef.current.selector = carouselSelectorRef.current;

    return () => {
      carousel.destroy();
      if (carouselRef) {
        carouselRef.current = null;
      }
    };
  }, [carouselRef, onInit, onResize, options]);
  return React.createElement(
    'div',
    { className: className, ref: carouselSelectorRef },
    children
  );
}

Carousel.defaultProps = {
  className: '',
  options: null,
  onInit: () => {},
  onResize: () => {},
  onChange: () => {},
  carouselRef: null,
  children: null
};

Carousel.propTypes = {
  className: PropTypes.string,
  options: PropTypes.objectOf(PropTypes.any),
  onInit: PropTypes.func,
  onResize: PropTypes.func,
  onChange: PropTypes.func,
  carouselRef: PropTypes.objectOf(PropTypes.object),
  children: PropTypes.arrayOf(PropTypes.element)
};

export default Carousel;

export function useCarouselDots(carouselRef) {
  const [nrOfDots, setNrOfDots] = useState(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  useCarouselCallbacks(carouselRef, {
    onInit: () => setNrOfDots(carouselRef.current.dots.getNrOfDots()),
    onChange: () => setActiveDotIndex(carouselRef.current.dots.nrOfActiveDot())
  });

  return {
    nrOfDots,
    activeDotIndex,
    onDotClick: index => carouselRef.current.dots.goToDot(index)
  };
}

function useCarouselCallbacks(carouselRef, callbacks) {
  const hookRef = useRef(null);
  if (!carouselsMap.get(carouselRef)) {
    carouselsMap.set(carouselRef, new Map());
  }
  carouselsMap.get(carouselRef).set(hookRef, callbacks);
}

function getCallbacks(carouselRef) {
  const callbacks = {
    onInit: [],
    onChange: []
  };
  const carouselMap = carouselsMap.get(carouselRef);
  if (carouselMap) {
    for (const hookCallbacks of carouselMap.values()) {
      for (const property in hookCallbacks) {
        callbacks[property].push(hookCallbacks[property]);
      }
    }
  }
  return callbacks;
}