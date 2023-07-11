import { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import Slider from 'components/Slider';

import device from './images/device.png';

const useScreenshotStyles = makeStyles(() => ({
  screenshot: {
    backgroundImage: ({ screenshotUrl }) => `url(${screenshotUrl})`,
    backgroundSize: 'cover',
    width: '100%',
    height: 0,
    paddingBottom: '104%',
  },
}));

const Screenshot = ({ className, screenshotUrl }) => {
  const classes = useScreenshotStyles({ screenshotUrl });

  return <div className={cx(classes.screenshot, className)} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  device: {
    display: 'flex',
    width: '100%',
  },
  slider: {
    position: 'absolute',
    width: '90%',
    right: '5%',
    bottom: 0,
  },
  pagination: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    bottom: 12,

    [theme.breakpoints.down('md')]: {
      bottom: 8,
    },
  },
  page: {
    width: 32,
    height: 8,
    cursor: 'pointer',
    background: theme.palette.secondary[200],
    margin: '0 8px',
    borderRadius: 2,
    border: 'none',
    outline: 'none',
    pointerEvents: 'auto',

    [theme.breakpoints.down('md')]: {
      width: 20,
      height: 6,
      margin: '0 6px',
    },
  },
  activePage: {
    background: theme.palette.primary.main,
  },
}));

const LinePreview = ({ className, autoplay = false, images = [] }) => {
  const classes = useStyles();
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  const slideTo = (index) => {
    setActiveIndex(index);
  };

  const onSlideChange = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.reset();
    }
  }, [images]);

  return (
    <div className={cx(classes.root, className)}>
      <img className={classes.device} src={device} alt={device} />
      <Slider
        ref={sliderRef}
        className={classes.slider}
        autoplay={autoplay}
        activeIndex={activeIndex}
        onSlideChange={onSlideChange}
      >
        {images.map((url) => (
          <Screenshot key={url} className={classes.slide} screenshotUrl={url} />
        ))}
      </Slider>
      {images.length > 1 && (
        <div className={classes.pagination}>
          {images.map((_, index) => (
            <div
              key={index}
              className={cx(classes.page, {
                [classes.activePage]: index === activeIndex,
              })}
              role="button"
              tabIndex={0}
              onClick={() => slideTo(index)}
              onKeyPress={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LinePreview;
