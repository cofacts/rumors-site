import { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';

import yellowLabel from './images/yellow-label.svg';
import blueLabel from './images/blue-label.svg';
import arrow from './images/arrow.svg';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -10,
    top: -17,
    width: 53,
    height: 43,
    zIndex: 2,
    paddingRight: 11,
    paddingBottom: 12,
    fontSize: 18,
    lineHeight: 1.45,
    fontWeight: 900,

    '& > img': {
      position: 'absolute',
      width: '100%',
      left: 0,
      top: 0,
      zIndex: -1,
    },
  },
  main: {
    background: 'white',
    borderRadius: 4,
  },
  mainContentWrapper: {
    padding: '20px 28px 28px',
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.45,
    marginBottom: 4,
  },
  mainSubTitle: {
    fontSize: 14,
    lineHeight: 1.45,
    letterSpacing: 0.25,
    color: theme.palette.secondary[300],
  },
  mainContent: {
    fontSize: 14,
    lineHeight: 1.45,
    letterSpacing: 0.25,
    marginTop: 20,
  },
  foldBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    fontSize: 14,
    lineHeight: 1.45,
    letterSpacing: 0.25,
    color: theme.palette.secondary[300],
    cursor: 'pointer',
  },
  arrow: {
    marginTop: 3,
    marginRight: 14,
    transform: ({ isOpen }) => `rotate(${isOpen ? 180 : 0}deg)`,
  },
  mask: {
    overflow: 'hidden',
  },
  subContentWrapper: {
    position: 'relative',
    paddingTop: 24,
  },
  decoLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    top: 0,
    left: 95,
    background: theme.palette.secondary[100],
    zIndex: -1,
  },
  subContent: {
    background: 'white',
    padding: '20px 40px 28px',
    borderRadius: 4,
    marginLeft: 28,

    '&:not(:last-child)': {
      marginBottom: 24,
    },
  },
  subContentTitleWrapper: {
    display: 'flex',
    fontSize: 18,
    lineHeight: 1.45,
    fontWeight: 500,
    marginBottom: 16,
  },
  subContentLabel: {
    color: ({ componentTheme }) =>
      componentTheme === 'yellow' ? theme.palette.primary.main : '#2DAEF7',
    marginRight: 20,
  },
  subContentTitle: {
    letterSpacing: 0.15,
  },
  subContentData: {
    width: '100%',

    '&:not(:last-child)': {
      marginBottom: 24,
    },
  },
}));

const Article = ({
  label,
  theme,
  title,
  subTitle,
  content,
  subContent = [],
}) => {
  const subContentRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const { subContentHeight } = useSpring({
    subContentHeight:
      subContentRef.current && isOpen ? subContentRef.current.offsetHeight : 0,
  });

  const classes = useStyles({ componentTheme: theme, isOpen });

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        <img src={theme === 'yellow' ? yellowLabel : blueLabel} />
        {label}
      </div>
      <div className={classes.main}>
        <div className={classes.mainContentWrapper}>
          <div className={classes.mainTitle}>{title}</div>
          <div className={classes.mainSubTitle}>{subTitle}</div>
          <div className={classes.mainContent}>{content}</div>
        </div>
        {subContent.length > 0 && (
          <div
            className={classes.foldBtn}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <img className={classes.arrow} src={arrow} />
            {isOpen ? '收起內容' : '展開內容'}
          </div>
        )}
      </div>
      {subContent.length > 0 && (
        <animated.div
          className={classes.mask}
          style={{ height: subContentHeight }}
        >
          <div ref={subContentRef} className={classes.subContentWrapper}>
            <div className={classes.decoLine} />
            {subContent.map(({ label, title, content = [] }, index) => (
              <div key={index} className={classes.subContent}>
                <div className={classes.subContentTitleWrapper}>
                  <div className={classes.subContentLabel}>{label}</div>
                  <div className={classes.subContentTitle}>{title}</div>
                </div>
                {content.map(({ type, data }, contentIndex) => {
                  if (type === 'image') {
                    return (
                      <img
                        key={contentIndex}
                        className={classes.subContentData}
                        src={data}
                      />
                    );
                  }

                  return (
                    <div key={contentIndex} className={classes.subContentData}>
                      {data}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default Article;
