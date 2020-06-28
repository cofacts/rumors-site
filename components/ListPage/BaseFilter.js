import { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import cx from 'clsx';
import BaseFilterOption from './BaseFilterOption';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 12,
    lineHeight: '20px',
    color: theme.palette.secondary[300],
    padding: `${theme.spacing(1)}px 18px 0`,

    [theme.breakpoints.up('md')]: {
      fontSize: 14,
      paddingTop: theme.spacing(1.5),
      borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    },
    '&:last-of-type': {
      borderBottom: 0,
    },
  },
  expandable: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.secondary[500],
    },
    '& > svg': {
      verticalAlign: 'middle',
    },
  },
  active: {
    color: theme.palette.primary[500],
  },
  body: {
    margin: 0 /* override dd defaults */,
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    '&:last-child': {
      borderBottom: 0,
    },

    padding: theme.spacing(0.5),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  dropdown: {
    maxWidth: 400,
    padding: '14px 20px',
    '& > *': {
      margin: '6px 4px',
    },
  },
  placeholder: {
    padding: '4px 10px',
    margin: 4,
  },
}));

/**
 * One row of filter in <Filters>.
 * Designed to add 2 grid cells in <Filters>'s grid.
 *
 * @param {string} props.title
 * @param {string?} props.placeholder - Shown when no options are selected
 * @param {boolean?} props.expandable - Makes options collapsible on desktop.
 *   Turning this on also hides filters not selected on desktop.
 * @param {Array<string>} props.selected - Selected option values
 * @param {Array<{value: string, label:string}>} props.options
 * @param {(selected: string[]) => void} props.onChange
 */
function BaseFilter({
  title,
  onChange = () => null,
  placeholder,
  expandable,
  selected = [],
  options = [],
}) {
  const classes = useStyles();
  const [expandEl, setExpandEl] = useState(null);

  // Note: this is implemented using JS, don't use it on places
  // that is going to cause flicker on page load!
  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

  const isValueSelected = Object.fromEntries(
    selected.map(value => [value, true])
  );
  const isExpandable = expandable && isDesktop;

  const handleOptionClicked = value => {
    if (isValueSelected[value]) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange(selected.concat(value));
    }
  };

  const handleExpand = e => {
    setExpandEl(e.currentTarget);
  };

  const handleCollapse = () => {
    setExpandEl(null);
  };

  const isExpanded = !!expandEl;
  const dtProps = isExpandable
    ? {
        onClick: isExpanded ? handleCollapse : handleExpand,
        'data-ga': 'FilterExpandButton',
      }
    : {};

  return (
    <>
      <dt
        className={cx(classes.title, {
          [classes.expandable]: isExpandable,
          [classes.active]: isExpanded,
        })}
        {...dtProps}
      >
        {title}
        {isExpandable && (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </dt>
      <Popover
        open={isExpanded}
        anchorEl={expandEl}
        onClose={handleCollapse}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: -4,
          horizontal: 'left',
        }}
        elevation={1}
      >
        <div className={classes.dropdown}>
          {options.map(option => (
            <BaseFilterOption
              key={option.value}
              selected={isValueSelected[option.value]}
              label={option.label}
              value={option.value}
              onClick={handleOptionClicked}
              chip
            />
          ))}
        </div>
      </Popover>
      <dd className={classes.body}>
        {placeholder && selected.length === 0 ? (
          <div className={classes.placeholder}>{placeholder}</div>
        ) : (
          options
            .filter(option =>
              // Only show selected items when BaseFilter is expandable
              isExpandable ? isValueSelected[option.value] : true
            )
            .map(option => (
              <BaseFilterOption
                key={option.value}
                label={option.label}
                value={option.value}
                selected={isValueSelected[option.value]}
                onClick={handleOptionClicked}
              />
            ))
        )}
      </dd>
    </>
  );
}

export default BaseFilter;
