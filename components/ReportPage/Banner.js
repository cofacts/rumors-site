import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { t } from 'ttag';

import bg from './images/banner-bg.png';
import logo from './images/logos/cofacts.png';
import yellowLogo from './images/logos/cofacts-yellow.png';
import message1 from './images/message-1.png';
import message2 from './images/message-2.png';
import message3 from './images/message-3.png';
import message4 from './images/message-4.png';
import star3 from './images/star3.png';
import star4 from './images/star4.png';
import characters from './images/banner-characters.png';
import dotsGroup from './images/dots-group.png';
import plane from './images/plane-1.png';
import plane2 from './images/plane-3.png';

const useStyles = makeStyles((theme) => ({
  '@keyframes flashing': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  '@keyframes floatingRight': {
    '0%': {
      transform: 'translate(0, 0)',
    },
    '50%': {
      transform: 'translate(10px, 10px)',
    },
    '100%': {
      transform: 'translate(0, 0)',
    },
  },
  '@keyframes floatingLeft': {
    '0%': {
      transform: 'translate(0, 0)',
    },
    '50%': {
      transform: 'translate(-10px, 10px)',
    },
    '100%': {
      transform: 'translate(0, 0)',
    },
  },
  banner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    background: '#6d28aa',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  container: {
    position: 'relative',
    width: 2042,
    height: ({ scale }) => 829 * scale,
    transform: ({ scale, offsetX }) =>
      `scale(${scale}) translateX(${offsetX}px)`,
    transformOrigin: 'top',
  },
  logo: {
    position: 'absolute',
    top: 300,
    right: 563,
  },
  title: {
    position: 'absolute',
    top: 390,
    left: 1221,
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: process.env.LOCALE === 'en_US' ? 2 : 7,
    lineHeight: 1.45,
    color: '#3d2e56',
  },
  message1: {
    position: 'absolute',
    top: 112,
    right: 94,

    [theme.breakpoints.down('sm')]: {
      top: 200,
      right: 310,
    },
  },
  message2: {
    position: 'absolute',
    top: 498,
    right: 744,
  },
  message3: {
    position: 'absolute',
    top: 98,
    right: 496,
    animation: '$floatingRight 1.5s infinite',
    animationTimingFunction: 'ease-in-out',
  },
  message4: {
    position: 'absolute',
    top: 300,
    right: 850,
  },
  plane: {
    position: 'absolute',
    top: 492,
    right: 452,
  },
  star3: {
    position: 'absolute',
    top: 130,
    right: 430,
    animation: '$flashing 1.5s infinite',
    animationTimingFunction: 'ease-in-out',

    [theme.breakpoints.down('sm')]: {
      top: 220,
      right: 650,
    },
  },
  star4: {
    position: 'absolute',
    top: 350,
    right: 900,
    animation: '$flashing 1.5s infinite',
    animationTimingFunction: 'ease-in-out',

    [theme.breakpoints.down('sm')]: {
      top: 530,
      right: 500,
    },
  },
  characters: {
    position: 'absolute',
    top: 73,
    left: 332,
    animation: '$floatingLeft 1.5s infinite',
    animationTimingFunction: 'ease-in-out',
  },
  mobileTitleWrapper: {
    padding: '87px 20px 0 0',
  },
  mobileTitle: {
    fontSize: 18,
    letterSpacing: process.env.LOCALE === 'en_US' ? 2 : 4,
    color: '#ffb700',
    margin: '0 0 0 76px',
  },
  dotsGroup: {
    width: '86%',
  },
  leftPlane: {
    position: 'absolute',
    width: '30%',
    top: 174,
    left: '-13%',
    animation: '$floatingLeft 1.5s infinite',
    animationTimingFunction: 'ease-in-out',
  },
  rightPlane: {
    position: 'absolute',
    width: '23%',
    top: 33,
    right: 0,
    animation: '$floatingLeft 1.5s infinite',
    animationTimingFunction: 'ease-in-out',
  },
}));

const Banner = () => {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);

  const classes = useStyles({ scale, offsetX });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const setTransform = () => {
      const scale =
        window.innerWidth < 960
          ? (window.innerWidth / 1440) * 1.1
          : window.innerWidth / 1440;

      setScale(scale);
      setOffsetX(window.innerWidth < 960 ? scale * 100 : 0);
    };

    setTransform();
    window.addEventListener('resize', setTransform);

    return () => window.removeEventListener('resize', setTransform);
  }, []);

  return (
    <div className={classes.banner}>
      {isMobile && (
        <>
          <div className={classes.mobileTitleWrapper}>
            <img className={classes.mobileLogo} src={yellowLogo} />
            <h1 className={classes.mobileTitle}>{t`Social Impact Report`}</h1>
          </div>
          <img className={classes.dotsGroup} src={dotsGroup} />
          <img className={classes.leftPlane} src={plane} />
          <img className={classes.rightPlane} src={plane} />
        </>
      )}
      <div className={classes.container}>
        <img className={classes.bg} src={bg} />
        <img className={classes.message1} src={message1} />
        {!isMobile && <img className={classes.message2} src={message2} />}
        {isMobile && <img className={classes.message4} src={message4} />}
        {!isMobile && <img className={classes.plane} src={plane2} />}
        {!isMobile && <img className={classes.logo} src={logo} />}
        {!isMobile && (
          <h1 className={classes.title}>{t`Social Impact Report`}</h1>
        )}
        {!isMobile && <img className={classes.message3} src={message3} />}
        <img className={classes.star3} src={star3} />
        <img className={classes.star4} src={star4} />
        <img className={classes.characters} src={characters} />
      </div>
    </div>
  );
};

export default Banner;
