import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';

import { NAVBAR_HEIGHT } from 'constants/size';

import backImage from './images/index-back.png';
import frontImage from './images/index-front.png';

const useStyles = makeStyles(theme => ({
  sectionIndex: {
    position: 'relative',
    width: '100%',
    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      height: '80vw',
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
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
  },
  front: {
    width: '100%',
    height: '100%',
    background: `url(${frontImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
  },
}));

const SectionIndex = () => {
  const classes = useStyles();

  const ref = useRef();
  const [backImageStyles, setBackImageStyles] = useSpring(() => ({
    backgroundPositionY: 0,
    config: { mass: 1, tension: 300, friction: 26 },
  }));

  const handleScroll = () => {
    if (window.pageYOffset <= window.innerHeight) {
      const posY = ref.current.getBoundingClientRect().top;
      const offset = window.pageYOffset - posY + NAVBAR_HEIGHT;

      setBackImageStyles({ backgroundPositionY: offset * 0.05 });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <section className={classes.sectionIndex} ref={ref}>
      <animated.div
        className={classes.back}
        style={{
          ...backImageStyles,
        }}
      />
      <div className={classes.front} />
    </section>
  );
};

export default SectionIndex;
