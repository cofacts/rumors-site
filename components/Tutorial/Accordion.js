import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  item: {
    border: 'none',
    outline: 'none',
    marginBottom: 20,
  },
  title: {
    width: '100%',
    padding: '12px 25px',
    background: 'white',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
    lineHeight: 1,
    color: theme.palette.secondary[500],
    cursor: 'pointer',

    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
  },
  activeTitle: {
    background: theme.palette.primary.main,
    color: 'white',
  },
  contentWrapper: {
    height: 0,
    margin: '0 14px',
    background: 'white',
    borderRadius: '0px 0px 8px 8px',
    overflowY: 'auto',
    transition: 'height 0.3s ease-in-out',

    '&::-webkit-scrollbar': {
      width: 12,
    },

    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },

    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.secondary[200],
    },
  },
  activeContentWrapper: {
    height: 143,
  },
  content: {
    padding: '12px 22px',
    fontSize: 18,
    letterSpacing: 0.5,
    lineHeight: 1.55,
    color: theme.palette.secondary[500],
  },
}));

const Accordion = ({
  className,
  data = [],
  activeIndex = 0,
  onClick = () => {},
}) => {
  const classes = useStyles();

  return (
    <div className={className}>
      {data.map(({ title, content }, index) => (
        <div
          key={index}
          className={classes.item}
          role="button"
          tabIndex={0}
          onClick={() => onClick(index)}
          onKeyPress={() => {}}
        >
          <div
            className={cx(classes.title, {
              [classes.activeTitle]: activeIndex === index,
            })}
          >
            {title}
          </div>
          <div
            className={cx(classes.contentWrapper, {
              [classes.activeContentWrapper]: activeIndex === index,
            })}
          >
            <div className={classes.content}>{content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
