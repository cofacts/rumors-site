import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(() => ({
  slider: {
    display: 'flex',
    position: 'relative',
    scrollSnapType: 'x mandatory',
    overflowX: 'scroll',
    width: '100%',
    scrollbarWidth: 'none',
    MsOverflowStyle: 'none',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  slideWrapper: {
    scrollSnapAlign: 'start',
    flexShrink: 0,
    width: '100%',
  },
}));

const Slider = (
  {
    className,
    children,
    autoplay = false,
    interval = 3000,
    slideWrapperClassName,
    initIndex = 0,
    onSlideChange = () => {},
  },
  ref
) => {
  const classes = useStyles();

  const [activeSlide, setActiveSlide] = useState(initIndex);
  const [timeoutId, setTimeoutId] = useState(null);

  const sliderRef = useRef(null);

  const slides = React.Children.toArray(children);
  const slidesAmount = slides.length;

  const slideTo = useCallback(
    (index, smooth = true) => {
      const slider = sliderRef.current;

      if (slider) {
        slider.scrollTo({
          left: slider.scrollWidth * (index / slidesAmount),
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    },
    [slidesAmount]
  );

  const autoplayNext = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    const id = setTimeout(() => {
      const nextSlide = activeSlide === slidesAmount - 1 ? 0 : activeSlide + 1;
      slideTo(nextSlide);
    }, interval);

    setTimeoutId(id);
  }, [slidesAmount, activeSlide, interval, timeoutId, slideTo]);

  useImperativeHandle(
    ref,
    () => ({
      activeIndex: activeSlide,
      slideTo,
      reset: () => {
        slideTo(initIndex);

        if (autoplay) {
          autoplayNext();
        }
      },
    }),
    [activeSlide, slideTo, initIndex, autoplay, autoplayNext]
  );

  useEffect(() => {
    const slider = sliderRef.current;

    slideTo(initIndex, false);

    const onScroll = () => {
      const slider = sliderRef.current;

      if (slider) {
        const index = Math.round(
          (slider.scrollLeft / slider.scrollWidth) * slidesAmount
        );

        setActiveSlide(index);
      }
    };

    if (slider) {
      slider.addEventListener('scroll', onScroll);
    }

    return () => {
      if (slider) {
        slider.removeEventListener('scroll', onScroll);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderRef, slidesAmount]);

  useEffect(() => {
    if (autoplay) {
      autoplayNext();
    } else {
      clearTimeout(timeoutId);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, activeSlide, interval]);

  useEffect(() => {
    onSlideChange(activeSlide);
  }, [activeSlide, onSlideChange]);

  return (
    <div ref={sliderRef} className={cx(classes.slider, className)}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cx(classes.slideWrapper, slideWrapperClassName)}
        >
          {slide}
        </div>
      ))}
    </div>
  );
};

export default forwardRef(Slider);
