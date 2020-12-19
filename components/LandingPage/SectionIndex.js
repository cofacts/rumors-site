import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';
import cx from 'clsx';

import { NAVBAR_HEIGHT } from 'constants/size';

import backImage from './images/index-back.png';
import frontImage from './images/index-front.png';
import frontImageEn from './images/index-front-en.png';

const COVER_ORIGINAL_WIDTH = 7812;
const COVER_ORIGINAL_HEIGHT = 1261;

const useStyles = makeStyles(theme => ({
  '@keyframes flashing': {
    from: {
      transform: 'translateX(0)',
    },
    to: {
      transform: `translateX(-${COVER_ORIGINAL_WIDTH}px)`,
    },
  },
  sectionIndex: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: -NAVBAR_HEIGHT,
    paddingTop: NAVBAR_HEIGHT,
  },
  imageWrapper: {
    width: '100%',
    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    minHeight: '45vw',

    [theme.breakpoints.down('sm')]: {
      height: `calc(80vw)`,
    },
  },
  back: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url(${backImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
    backgroundColor: theme.palette.common.yellow,
    backgroundRepeat: 'repeat-x',
    zIndex: -1,
  },
  scaleWrapper: {
    width: COVER_ORIGINAL_WIDTH,
    height: COVER_ORIGINAL_HEIGHT,
    transformOrigin: 'left top',
    flexShrink: 0,

    '& > img': {
      width: '100%',
      animation: '$flashing 1.5s steps(3) infinite',
    },
  },
}));

const SectionIndex = () => {
  const classes = useStyles();

  const ref = useRef();
  const [{ offset }, setOffset] = useSpring(() => ({
    offset: 0,
    config: { mass: 1, tension: 300, friction: 26 },
  }));

  const [coverHeight, setCoverHeight] = useState(0);

  const handleScroll = () => {
    if (ref.current && window.pageYOffset <= window.innerHeight) {
      const posY = ref.current.getBoundingClientRect().top;
      const nextOffset = window.pageYOffset - posY + NAVBAR_HEIGHT;

      setOffset({
        offset: nextOffset,
      });
    }
  };

  const handleResize = () => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setCoverHeight(height);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={classes.sectionIndex}>
      <div className={classes.imageWrapper} ref={ref}>
        <animated.div
          className={classes.back}
          style={{
            backgroundPositionX: offset.interpolate(
              value => `calc(50% - ${value * 0.05 * -1}px)`
            ),
          }}
        />
        <div
          className={cx(classes.front, classes.translateWrapper)}
          style={{
            transform: `translateX(calc(
            (
              ${coverHeight *
                (COVER_ORIGINAL_WIDTH / 3 / COVER_ORIGINAL_HEIGHT)}px
                  - 100vw) / 2 * -1
          ))`,
          }}
        >
          <div
            className={classes.scaleWrapper}
            style={{
              transform: `scale(${coverHeight / COVER_ORIGINAL_HEIGHT})`,
            }}
          >
            <img
              className={classes.image}
              src={process.env.LOCALE === 'en_US' ? frontImageEn : frontImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionIndex;
