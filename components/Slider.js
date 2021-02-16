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
    activeIndex,
    onSlideChange = () => {},
  },
  ref
) => {
  const classes = useStyles();

  const [activeSlide, setActiveSlide] = useState(activeIndex || initIndex);

  const timeoutId = useRef(null);
  const sliderRef = useRef(null);

  const slides = React.Children.toArray(children);
  const slidesAmount = slides.length;

  const slideTo = useCallback(
    (index, { smooth = true } = {}) => {
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
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }

    const id = setTimeout(() => {
      const nowActiveIndex = activeIndex || activeSlide;
      const nextIndex =
        nowActiveIndex === slidesAmount - 1 ? 0 : nowActiveIndex + 1;

      if (activeIndex || activeIndex === 0) {
        onSlideChange(nextIndex);
      } else {
        slideTo(nextIndex);
      }

      if (autoplay) {
        autoplayNext();
      } else {
        clearTimeout(timeoutId.current);
      }
    }, interval);

    timeoutId.current = id;
  }, [
    slidesAmount,
    activeIndex,
    activeSlide,
    interval,
    timeoutId,
    onSlideChange,
    slideTo,
    autoplay,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      activeIndex: activeIndex || activeSlide,
      reset: (resetIndex = 0) => {
        if (activeIndex || activeIndex === 0) {
          onSlideChange(resetIndex);
        } else {
          slideTo(resetIndex, { smooth: false });
        }

        if (autoplay) {
          autoplayNext();
        }
      },
    }),
    [activeIndex, activeSlide, slideTo, onSlideChange, autoplay, autoplayNext]
  );

  useEffect(() => {
    const slider = sliderRef.current;

    const onScroll = () => {
      const slider = sliderRef.current;

      if (slider) {
        const nextIndex = Math.round(
          (slider.scrollLeft / slider.scrollWidth) * slidesAmount
        );

        setActiveSlide(nextIndex);
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
  }, [sliderRef, slidesAmount, activeIndex, onSlideChange]);

  useEffect(() => {
    if (autoplay) {
      autoplayNext();
    } else {
      clearTimeout(timeoutId.current);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [autoplay, autoplayNext, interval]);

  useEffect(() => {
    if ((activeIndex || activeIndex === 0) && activeIndex !== activeSlide) {
      slideTo(activeIndex);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, slideTo]);

  useEffect(() => {
    onSlideChange(activeSlide);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide]);

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
