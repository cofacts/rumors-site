import { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  text: {
    display: 'box',
    boxOrient: 'vertical',
    margin: '5px 0',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineClamp: 3,
    [theme.breakpoints.up('md')]: {
      margin: '12px 0',
      lineClamp: 2,
    },
    '&.show-more': {
      lineClamp: 'unset',
    },
  },
  showMore: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    background: theme.palette.common.white,
    display: ({ length, maxCharsPerLine }) =>
      length > maxCharsPerLine * 3 ? 'block' : 'none',
    color: '#2079F0',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      display: ({ length, maxCharsPerLine }) =>
        length > maxCharsPerLine * 2 ? 'block' : 'none',
    },
    '&:before': {
      position: 'absolute',
      left: -48,
      display: 'block',
      background: 'linear-gradient(to right, transparent, white 80%)',
      height: '1.5em',
      width: 48,
      content: '""',
    },
  },
}));

function TextExpansion({ content, disable = false }) {
  const textRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState(0);

  const classes = useStyles({
    length: content.length,
    maxCharsPerLine,
    showMore,
  });

  useEffect(() => {
    const width = textRef.current.clientWidth;
    const fontSize = parseFloat(
      window.getComputedStyle(textRef.current).getPropertyValue('font-size')
    );
    setMaxCharsPerLine(~~(width / fontSize));
  }, [content]);

  return (
    <div className={classes.root} ref={textRef}>
      <p className={cx(classes.text, showMore && 'show-more')}>{content}</p>
      <span
        className={classes.showMore}
        onClick={() => (disable ? false : setShowMore(!showMore))}
      >
        ({showMore ? t`Show Less` : t`Show More`})
      </span>
    </div>
  );
}

export default TextExpansion;
