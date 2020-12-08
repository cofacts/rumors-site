import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';
import { Dialog } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { animated, useSpring } from 'react-spring';

import upgradeImage from './images/upgrade.png';
import prevLevelIcon from './images/prev-level-icon.svg';
import nextLevelIcon from './images/next-level-icon.svg';
import closeIcon from './images/close.svg';

const getConicGradient = (color1, color2, startAngle) => {
  return `conic-gradient( 
  ${Array.from(Array(25).keys())
    .map((_, i) => {
      const start = startAngle;
      const angle = 360 / 24;
      const color = i % 2 === 1 ? color1 : color2;

      if (i === 0) {
        return `
         ${color} ${start + angle * i}deg,
       `;
      }

      if (i === 24) {
        return `${color} ${start + angle * (i - 1)}deg ${start + angle * i}deg
        `;
      }

      return `${color} ${start + angle * (i - 1)}deg ${start + angle * i}deg,
       `;
    })
    .join('')} 
)`;
};

const useStyles = makeStyles(theme => ({
  '@keyframes spin': {
    '0%': {
      background: getConicGradient(
        theme.palette.common.yellow,
        theme.palette.common.orange2,
        0
      ),
    },
    '20%': {
      background: getConicGradient(
        theme.palette.common.yellow,
        theme.palette.common.orange2,
        3
      ),
    },
    '40%': {
      background: getConicGradient(
        theme.palette.common.yellow,
        theme.palette.common.orange2,
        6
      ),
    },
    '60%': {
      background: getConicGradient(
        theme.palette.common.yellow,
        theme.palette.common.orange2,
        9
      ),
    },
    '80%': {
      background: getConicGradient(
        theme.palette.common.yellow,
        theme.palette.common.orange2,
        12
      ),
    },
    '100%': {
      background: getConicGradient(
        theme.palette.common.yellow,
        theme.palette.common.orange2,
        15
      ),
    },
  },

  root: {
    overflow: 'hidden',
  },
  dialogContent: {
    MsOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,

    '&::WebkitScrollbar': {
      display: 'none',
    },
  },
  top: {
    position: 'relative',
    height: 0,
    paddingBottom: '100%',
    background: theme.palette.common.yellow,
    backgroundImage: ({ stage }) => (stage <= 2 ? `url(${upgradeImage})` : ''),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  spinBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingBottom: '100%',
    animation: '$spin 1s infinite',
    animationTimingFunction: 'linear',
  },
  bottom: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    padding: 24,
  },
  close: {
    position: 'absolute',
    top: 24,
    right: 24,
    cursor: 'pointer',
  },
  titleLg: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 1.46,
    margin: '0 0 16px 0',
  },
  titleMd: {
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 1.46,
    margin: '0 0 16px 0',
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 1.45,
    margin: 0,
  },
  levelContainer: {
    display: 'flex',
    marginTop: 46,
    width: '100%',
    padding: '0 16px',
    justifyContent: 'space-between',
  },
  level: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 1.55,

    '& > img': {
      marginBottom: 5,
    },
  },
  progress: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  progressBarContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 'calc(100% - 32px)',
    height: 24,
    borderRadius: 24,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '0 5px',
    marginBottom: 6,
  },
  progressBar: {
    position: 'relative',
    height: 12,
    borderRadius: 24,
    background: theme.palette.primary.main,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.55,

    '& > span:first-child': {
      marginRight: 4,
    },
  },
  dynamticNextLevel: {
    position: 'absolute',
  },
  button: {
    display: 'flex',
    width: 156,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.primary.main,
    borderRadius: 31,
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 1.55,
    color: 'white',
    marginTop: 36,
    cursor: 'pointer',
  },
}));

const TransitionComponent = (props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
};

const Transition = React.forwardRef(TransitionComponent);

export const UpgradeDialogLayout = ({
  open,
  onClose,
  prevLevel,
  prevLevelScore,
  nextLevel,
  nextLevelScore,
}) => {
  const timerRef = useRef(null);
  const [stage, setStage] = useState(0);

  const classes = useStyles({ stage });

  const { progress } = useSpring({
    progress: stage <= 1 ? (prevLevelScore / nextLevelScore) * 100 : 100,
  });
  const nextLevelProps = useSpring({
    scale: stage >= 3 ? 3.5 : 1,
    right: stage >= 3 ? 'calc(25% + 135px)' : 'calc(0% + 40px)',
    bottom: stage >= 3 ? 'calc(50% + 90px)' : 'calc(0% + 28px)',
  });

  useEffect(() => {
    if (open) {
      setStage(1);
    } else {
      setStage(0);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  }, [open]);

  useEffect(() => {
    if (stage < 4 && stage !== 0) {
      timerRef.current = setTimeout(() => {
        setStage(value => value + 1);
      }, 800);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [stage]);

  return (
    <>
      <Dialog
        className={classes.root}
        TransitionComponent={Transition}
        keepMounted
        open={stage > 0}
        onClose={onClose}
        scroll="body"
        fullWidth
      >
        <div className={classes.dialogContent}>
          <div className={classes.top}>
            {stage >= 4 && <div className={classes.spinBg} />}
          </div>
          <div className={classes.bottom}>
            <div className={classes.close} onClick={onClose}>
              <img src={closeIcon} alt="close-icon" />
            </div>

            {stage <= 3 && (
              <>
                {/* TODO: translate */}
                <h3 className={classes.titleLg}>恭喜你！</h3>
                <p className={classes.contentText}>
                  公道值又破表了，只好讓你繼續升級啦！
                </p>
                <div className={classes.levelContainer}>
                  <div className={classes.level}>
                    <img src={prevLevelIcon} alt="prev-level-icon" />
                    <div>Lv. {prevLevel}</div>
                  </div>
                  <div className={classes.progress}>
                    <div className={classes.progressBarContainer}>
                      <animated.div
                        className={classes.progressBar}
                        style={{
                          width: progress.interpolate(value => `${value}%`),
                        }}
                      />
                    </div>
                    {/* TODO: translate */}
                    <div className={classes.progressText}>
                      <span>公道值</span>
                      <animated.span>
                        {progress.interpolate(
                          value =>
                            `${((value / 100) * nextLevelScore).toFixed(0)}`
                        )}
                      </animated.span>
                      <span>/{nextLevelScore}</span>
                    </div>
                  </div>
                  <div
                    className={classes.level}
                    style={{
                      opacity: stage >= 2 ? 0 : 1,
                    }}
                  >
                    <img src={nextLevelIcon} alt="next-level-icon" />
                    <div>Lv. {nextLevel}</div>
                  </div>
                </div>
              </>
            )}

            {stage >= 4 && (
              <>
                {/* TODO: translate */}
                <h3 className={classes.titleMd}>嗨嗨！闢謠天師</h3>
                <p className={classes.contentText}>
                  請繼續為真真假假的世界盡一份力！
                </p>
                <div className={classes.button} onClick={onClose}>
                  好的
                </div>
              </>
            )}
          </div>

          {stage >= 2 && (
            <animated.div
              className={cx(classes.level, classes.dynamticNextLevel)}
              style={{
                ...nextLevelProps,
                transform: nextLevelProps.scale.interpolate(
                  value => `scale(${value})`
                ),
              }}
            >
              <img src={nextLevelIcon} alt="next-level-icon" />
              <div>Lv. {nextLevel}</div>
            </animated.div>
          )}
        </div>
      </Dialog>
    </>
  );
};

const UpgradeDialog = () => {
  const [stage, setStage] = useState(0);

  const handleClose = () => {
    setStage(0);
  };

  return <UpgradeDialogLayout stage={stage} onClose={handleClose} />;
};

export default UpgradeDialog;
