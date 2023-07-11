import { useState, useRef, useEffect } from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  inputBox: {
    position: 'relative',
    width: '100%',
    padding: 12,
    background: 'white',
    borderRadius: 8,

    [theme.breakpoints.down('sm')]: {
      padding: 8,
    },

    '& > textarea': {
      width: '100%',
      resize: 'none',
      border: 'none',
      fontSize: 24,
      lineHeight: '35px',
      color: theme.palette.secondary[300],
      marginBottom: 4,
      fontFamily: theme.typography.fontFamily,

      '&:focus': {
        outline: 'none',
        border: 'none',
      },

      [theme.breakpoints.down('sm')]: {
        fontWeight: 500,
        fontSize: 18,
        lineHeight: '26px',
        letterSpacing: 0.15,
      },
    },
  },
  tagWrapper: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    overflow: 'auto',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tag: {
    border: `2px solid ${theme.palette.secondary[200]}`,
    boxSizing: 'border-box',
    borderRadius: 40,
    padding: '2px 18px 4px',
    fontSize: 24,
    lineHeight: '35px',
    color: theme.palette.secondary[300],
    cursor: 'pointer',
    whiteSpace: 'nowrap',

    '&:not(:last-child)': {
      marginRight: 6,
    },

    [theme.breakpoints.down('sm')]: {
      fontWeight: 500,
      fontSize: 18,
      lineHeight: '26px',
      letterSpacing: 0.15,
    },
  },
  mask: {
    position: 'absolute',
    width: 66,
    height: 50,
    right: 0,
    bottom: 12,
    background: `linear-gradient(270deg, #FFFFFF 27.08%, rgba(255, 255, 255, 0) 100%)`,
    pointerEvents: 'none',

    [theme.breakpoints.down('sm')]: {
      bottom: 8,
    },
  },
}));

const InputBox = ({
  className,
  value = '',
  tags = [],
  onChange = () => {},
}) => {
  const classes = useStyles();
  const tagWrapperRef = useRef(null);
  const [showShadow, setShowShadow] = useState(false);

  const onScrollTagWrapper = () => {
    if (tagWrapperRef && tagWrapperRef.current) {
      const { offsetWidth, scrollWidth, scrollLeft } = tagWrapperRef.current;
      const isEnd = scrollLeft + offsetWidth >= scrollWidth;

      if (isEnd) {
        setShowShadow(false);
      } else {
        setShowShadow(true);
      }
    }
  };

  useEffect(() => {
    if (tagWrapperRef && tagWrapperRef.current) {
      const { offsetWidth, scrollWidth } = tagWrapperRef.current;

      if (scrollWidth > offsetWidth) {
        setShowShadow(true);
      }
    }
  }, [tagWrapperRef]);

  return (
    <div className={cx(classes.inputBox, className)}>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <div
        className={classes.tagWrapper}
        ref={tagWrapperRef}
        onScroll={onScrollTagWrapper}
      >
        {tags.map((tag) => (
          <div
            key={tag}
            className={classes.tag}
            onClick={() => {
              onChange(value ? value + ' ' + tag : tag);
            }}
          >
            {tag}
          </div>
        ))}
      </div>
      {showShadow && <div className={classes.mask} />}
    </div>
  );
};

export default InputBox;
