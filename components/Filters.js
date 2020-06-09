import { useState, useEffect } from 'react';
import { Paper } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import cx from 'clsx';
import { t } from 'ttag';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '6px 16px',
    display: 'flex',
  },
  title: {
    minWidth: '6em',
    padding: '0 8px',
    alignSelf: 'center',
    color: theme.palette.secondary[300],
  },
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: '1 1 auto',
  },
  placeholder: {
    alignSelf: 'center',
    padding: '4px 10px',
    margin: 4,
  },
  expand: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  control: {
    padding: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    backgroundColor: 'inherit',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: theme.palette.secondary[300],
    '&:hover': {
      color: theme.palette.secondary[500],
    },
    '&.active': {
      color: theme.palette.primary[500],
    },
  },
  dropdown: {
    position: 'absolute',
    left: -24,
    top: 36,
    padding: 10,
    minWidth: 300,
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  },
  dropdownOptions: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const Filters = withStyles(theme => ({
  root: {
    '& > *:first-child': {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    '& > *:last-child': {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    '& > *:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
}))(({ className, classes, children }) => (
  <div className={cx(classes.root, className)}>{children}</div>
));

const Option = withStyles(theme => ({
  root: {
    borderRadius: 55,
    padding: '4px 10px',
    margin: '4px 2px',
    cursor: 'pointer',
    border: ({ chip, selected }) =>
      chip || selected ? `1px solid ${theme.palette.secondary[100]}` : 'none',
  },
  selected: {
    background: theme.palette.secondary[50],
  },
}))(({ classes, selected, label, onClick }) => (
  <span
    className={cx(classes.root, selected && classes.selected)}
    onClick={onClick}
  >
    {label}
  </span>
));

export function Filter({
  title,
  onChange = () => null,
  placeholder,
  onlySelected,
  expandable,
  options = [],
  multiple = false,
}) {
  const classes = useStyles();
  const [selected, setSelected] = useState(
    Object.fromEntries(options.map(option => [option.value, !!option.selected]))
  );
  const [expand, setExpand] = useState(false);

  const onOptionClicked = value => () => {
    if (multiple) {
      const newState = { ...selected, [value]: !selected[value] };
      setSelected(newState);
      onChange(
        Object.entries(newState)
          .filter(entry => entry[1])
          .map(entry => entry[0])
      );
    } else {
      const newState = Object.fromEntries(
        Object.entries(selected).map(([key]) => [key, key === value])
      );
      setSelected(newState);
      onChange(value);
    }
  };

  useEffect(() => {
    const newSelected = Object.fromEntries(
      options.map(option => [option.value, !!option.selected])
    );
    setSelected(newSelected);
  }, [options]);

  return (
    <Paper className={classes.root} elevation={0} square>
      <div className={classes.title}>
        {expandable ? (
          <div className={classes.expand}>
            <button
              className={cx(classes.control, expand && 'active')}
              type="button"
              onClick={() => setExpand(e => !e)}
              data-ga="FilterExpandButton"
            >
              {title}
              {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
            {expand && (
              <Paper className={classes.dropdown} elevation={3}>
                <div className={classes.dropdownOptions}>
                  {options.map(option => (
                    <Option
                      {...option}
                      key={option.value}
                      selected={selected[option.value]}
                      onClick={onOptionClicked(option.value)}
                      chip
                    />
                  ))}
                </div>
              </Paper>
            )}
          </div>
        ) : (
          title
        )}
      </div>
      <div className={classes.body}>
        {placeholder && !Object.values(selected).includes(true) ? (
          <span className={classes.placeholder}>{placeholder}</span>
        ) : (
          options
            .filter(option => (onlySelected ? selected[option.value] : true))
            .map(option => (
              <Option
                {...option}
                key={option.value}
                selected={onlySelected ? false : selected[option.value]}
                onClick={onOptionClicked(option.value)}
              />
            ))
        )}
      </div>
    </Paper>
  );
}

export default Filters;
