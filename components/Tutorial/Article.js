import { useRef, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from 'react-spring';
import cx from 'clsx';
import { t } from 'ttag';

import Ribbon from 'components/Ribbon';

import arrow from './images/arrow.svg';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  ribbon: {
    padding: '0 10px 4px 14px',
    marginBottom: -19,
    fontSize: 24,
    lineHeight: 1.45,
    fontWeight: 900,

    [theme.breakpoints.down('xs')]: {
      marginBottom: -15,
      fontSize: 18,
    },
  },
  main: {
    background: 'white',
    borderRadius: 4,
  },
  mainContentWrapper: {
    padding: '24px 28px 28px',
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,

    [theme.breakpoints.down('xs')]: {
      padding: '24px 14px 14px',
    },
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.5,
    marginBottom: 4,

    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      marginBottom: 8,
    },
  },
  mainSubTitle: {
    fontSize: 14,
    lineHeight: 1.45,
    letterSpacing: 0.25,
    color: theme.palette.secondary[300],

    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  mainContent: {
    fontSize: 14,
    lineHeight: 1.45,
    letterSpacing: 0.25,
    marginTop: 20,
    whiteSpace: 'pre-line',

    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      lineHeight: 1.67,
      marginTop: 10,
    },
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

    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  arrow: {
    marginTop: 3,
    marginRight: 14,
    transform: ({ isOpen }) => `rotate(${isOpen ? 180 : 0}deg)`,

    [theme.breakpoints.down('xs')]: {
      marginRight: 8,
    },
  },
  mask: {
    overflow: 'hidden',
  },
  subContentWrapper: {
    position: 'relative',
    paddingTop: 24,

    [theme.breakpoints.down('xs')]: {
      paddingTop: 16,
    },
  },
  decoLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    top: 0,
    left: 95,
    background: theme.palette.secondary[100],
    zIndex: -1,

    [theme.breakpoints.down('xs')]: {
      left: 24,
    },
  },
  subContent: {
    background: 'white',
    padding: '20px 40px 28px',
    borderRadius: 4,
    marginLeft: 28,
    whiteSpace: 'pre-line',

    '&:not(:last-child)': {
      marginBottom: 24,

      [theme.breakpoints.down('xs')]: {
        marginBottom: 16,
      },
    },

    [theme.breakpoints.down('xs')]: {
      marginLeft: 10,
      padding: '15px 15px 23px',
    },
  },
  subContentTitleWrapper: {
    display: 'flex',
    fontSize: 18,
    lineHeight: 1.45,
    fontWeight: 500,
    marginBottom: 16,

    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 700,
    },
  },
  subContentLabel: {
    color: ({ componentTheme }) =>
      componentTheme === 'yellow'
        ? theme.palette.primary.main
        : theme.palette.common.blue2,
    marginRight: 20,
    flexShrink: 0,

    [theme.breakpoints.down('xs')]: {
      marginRight: 30,
    },
  },
  subContentTitle: {
    letterSpacing: 0.15,
  },
  subContentData: {
    display: 'block',
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 1.45,
    color: theme.palette.secondary.main,

    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      lineHeight: 1.67,
    },

    '&:not(:first-child)': {
      marginTop: 24,
    },
  },
  subContentImage: {
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subContentLink: {
    lineBreak: 'anywhere',

    '&:not(:first-child)': {
      display: 'block',
      marginTop: 8,
    },
  },
}));

const Article = ({
  className,
  label,
  theme,
  title,
  subTitle,
  content,
  subContent = [],
}) => {
  const subContentRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const [{ subContentHeight }, updateSpringProps] = useSpring(() => ({
    subContentHeight:
      subContentRef.current && isOpen ? subContentRef.current.offsetHeight : 0,
  }));

  const classes = useStyles({ componentTheme: theme, isOpen });

  const updateSubContentHeight = useCallback(() => {
    const nextHeight =
      subContentRef.current && isOpen ? subContentRef.current.offsetHeight : 0;

    updateSpringProps({
      subContentHeight: nextHeight,
    });
  }, [subContentRef, isOpen, updateSpringProps]);

  useEffect(() => {
    window.addEventListener('resize', updateSubContentHeight);

    return () => window.removeEventListener('resize', updateSubContentHeight);
  }, [updateSubContentHeight]);

  useEffect(() => {
    updateSubContentHeight();
  }, [isOpen, updateSubContentHeight]);

  useEffect(() => {
    setIsOpen(false);
  }, [theme, title, subTitle, content, subContent]);

  return (
    <div className={cx(classes.root, className)}>
      <Ribbon className={classes.ribbon} theme={theme}>
        {label}
      </Ribbon>
      <div className={classes.main}>
        <div className={classes.mainContentWrapper}>
          <div className={classes.mainTitle}>{title}</div>
          <div className={classes.mainSubTitle}>{subTitle}</div>
          {content && <div className={classes.mainContent}>{content}</div>}
        </div>
        {subContent.length > 0 && (
          <div
            className={classes.foldBtn}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <img className={classes.arrow} src={arrow} />
            {isOpen ? t`Collapse` : t`Expand`}
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
            {subContent.map(({ title, content = [] }, index) => {
              const stepNo = index + 1;

              return (
                <div key={index} className={classes.subContent}>
                  <div className={classes.subContentTitleWrapper}>
                    <div className={classes.subContentLabel}>
                      {t`Step ${stepNo}`}
                    </div>
                    <div className={classes.subContentTitle}>{title}</div>
                  </div>
                  {content.map(({ type, data }, contentIndex) => {
                    if (type === 'image') {
                      return (
                        <img
                          key={contentIndex}
                          className={cx(
                            classes.subContentData,
                            classes.subContentImage
                          )}
                          src={data}
                        />
                      );
                    }

                    if (type === 'link') {
                      return (
                        <a
                          key={contentIndex}
                          href={data}
                          className={cx(
                            classes.subContentData,
                            classes.subContentLink
                          )}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {data}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={contentIndex}
                        className={classes.subContentData}
                      >
                        {data}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default Article;
