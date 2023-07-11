import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';

import { NAVBAR_HEIGHT } from 'constants/size';

import backImage from './images/index-back.png';
import landingZh from './images/landing-zh.png';
import landingEn from './images/landing-en.png';
import landingAnimated from './images/landing-animated.png';

const landingImage = process.env.LOCALE === 'en_US' ? landingEn : landingZh;

const useStyles = makeStyles((theme) => ({
  '@keyframes flashing': {
    '33%': {
      backgroundPosition: 'center top',
    },
    '66%': {
      backgroundPosition: 'center center',
    },
    '100%': {
      backgroundPosition: 'center bottom',
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
    height: '80vw',
    background: `url(${landingImage}) center center no-repeat`,
    backgroundSize: 'auto 100%',
    position: 'relative', // for ::before

    [theme.breakpoints.up('md')]: {
      height: `calc(80vh - ${NAVBAR_HEIGHT}px)`,
    },

    '&::before': {
      position: 'absolute',
      content: '""',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      background: `url(${landingAnimated}) center top no-repeat`,
      backgroundSize: 'auto 300%',
      animation: '$flashing 1.5s step-start infinite',
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
}));

const SectionIndex = () => {
  const classes = useStyles();

  const ref = useRef();
  const [{ offset }, setOffset] = useSpring(() => ({
    offset: 0,
    config: { mass: 1, tension: 300, friction: 26 },
  }));

  const handleScroll = () => {
    if (ref.current && window.pageYOffset <= window.innerHeight) {
      const posY = ref.current.getBoundingClientRect().top;
      const nextOffset = window.pageYOffset - posY + NAVBAR_HEIGHT;

      setOffset({
        offset: nextOffset,
      });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <section className={classes.sectionIndex}>
      <div className={classes.imageWrapper} ref={ref} />
      <animated.div
        className={classes.back}
        style={{
          backgroundPositionX: offset.interpolate(
            (value) => `calc(50% - ${value * 0.05 * -1}px)`
          ),
        }}
      />
    </section>
  );
};

export default SectionIndex;
