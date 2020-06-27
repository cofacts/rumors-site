import { useState } from 'react';
import { Paper } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import cx from 'clsx';

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

/**
 *
 * @param {string} props.title
 * @param {string?} props.placeholder
 * @param {boolean?} props.onlySelected - Show selected items only
 * @param {boolean?} props.expandable - Makes options collapsible
 * @param {Array<string>} props.selected - Selected option values
 * @param {Array<{value: string, label:string}>} props.options
 * @param {(selected: string[]) => void} props.onChange
 */
export function BaseFilter({
  title,
  onChange = () => null,
  placeholder,
  onlySelected,
  expandable,
  selected = [],
  options = [],
}) {
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const isValueSelected = Object.fromEntries(
    selected.map(value => [value, true])
  );

  const onOptionClicked = value => () => {
    if (isValueSelected[value]) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange(selected.concat(value));
    }
  };

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
                      selected={isValueSelected[option.value]}
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
        {placeholder && selected.length === 0 ? (
          <span className={classes.placeholder}>{placeholder}</span>
        ) : (
          options
            .filter(option =>
              onlySelected ? isValueSelected[option.value] : true
            )
            .map(option => (
              <Option
                {...option}
                key={option.value}
                selected={isValueSelected[option.value]}
                onClick={onOptionClicked(option.value)}
              />
            ))
        )}
      </div>
    </Paper>
  );
}

export default BaseFilter;
