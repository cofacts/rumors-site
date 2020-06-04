import { useRef, useState, useEffect, forwardRef } from 'react';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonGroup, Button, Menu, MenuItem } from '@material-ui/core';
import { c, t } from 'ttag';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonGroup: {
    border: `1px solid ${theme.palette.secondary[100]}`,
  },
  calendarButton: {
    background: theme.palette.common.white,
    padding: 5,
    minWidth: 0,

    '&:hover': {
      background: theme.palette.secondary[100],
      color: theme.palette.secondary[300],
    },
    [theme.breakpoints.up('md')]: {
      padding: 7,
    },
  },
  calendarIcon: {
    fontSize: 14,
    color: theme.palette.secondary[300],
    [theme.breakpoints.up('md')]: {
      fontSize: 18,
    },
  },
  selectButton: {
    background: theme.palette.common.white,
    padding: '0px 5px',
  },
  startDate: {
    background: theme.palette.common.white,
    marginLeft: '0 !important',
    border: `1px solid ${theme.palette.secondary[100]}`,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  to: {
    padding: '0 11px',
  },
  endDate: {
    background: theme.palette.common.white,
    border: `1px solid ${theme.palette.secondary[100]}`,
    borderRadius: 4,
    padding: '1.5px 0',
    minWidth: 100,
    [theme.breakpoints.up('md')]: {
      padding: '5.5px 0',
    },
  },
}));

const options = [
  { value: 'all', label: c('Time range dropdown').t`All` },
  { value: 'now-1d/d', label: t`In 1 Day` },
  { value: 'now-1w/d', label: t`In 1 Week` },
  { value: 'now-1m/d', label: t`In 1 Month` },
  { value: 'custom', label: c('Time range dropdown').t`Custom` },
];

/**
 * @param {{GTE: string?, LTE: string?}} range
 * @return {string} one of options' value
 */
function getSelectedFromRange(range) {
  if (!range) return 'all';
  if (range.LTE) return 'custom';

  const option = options.find(o => o.value === range.GTE);
  return option ? option.value : 'custom';
}

/*
  material ui actually passes down some non-DOM props to children,
  and this cause some warning on runtime.
  but I want to use the ButtonGroup styles, so I use this hacky workaround.
*/
const Input = forwardRef(({ value, className, type, onChange }, ref) => (
  <input
    ref={ref}
    value={value}
    className={className}
    type={type}
    onChange={onChange}
  />
));
Input.displayName = 'input';

function TimeRange({ onChange = () => null, range }) {
  const [anchor, setAnchor] = useState(null);
  const [selected, setSelected] = useState(getSelectedFromRange(range));
  const [customValue, setCustomValue] = useState({
    GTE: range?.GTE,
    LTE: range?.LTE,
  });
  const anchorEl = useRef(null);
  const classes = useStyles();

  const openMenu = () => setAnchor(anchorEl.current);
  const closeMenu = () => setAnchor(null);
  const select = option => () => {
    setSelected(option);
    if (option !== 'custom') {
      onChange(option === 'all' ? null : { GTE: option });
    }
    closeMenu();
  };

  const setAndUpdateValue = value => {
    setCustomValue(value);
    onChange(value);
  };

  // update state when range prop change
  useEffect(() => {
    setCustomValue(customValue => {
      if (!range) return customValue;
      return customValue.GTE !== range.GTE || customValue.LTE !== range.LTE
        ? range
        : customValue;
    });

    setSelected(() => getSelectedFromRange(range));
  }, [range]);

  const custom = selected === 'custom';

  return (
    <div className={classes.root}>
      <ButtonGroup classes={{ contained: classes.buttonGroup }}>
        <Button className={classes.calendarButton} onClick={openMenu}>
          <DateRangeIcon className={classes.calendarIcon} />
        </Button>
        {custom ? (
          <Input
            ref={anchorEl}
            value={customValue.GTE}
            className={classes.startDate}
            onChange={e => {
              e.persist();
              const newValue = { ...customValue, GTE: e.target.value };
              setAndUpdateValue(newValue);
            }}
            type="date"
          />
        ) : (
          <Button
            className={classes.selectButton}
            ref={anchorEl}
            onClick={openMenu}
          >
            {options.find(option => option.value === selected).label}
          </Button>
        )}
      </ButtonGroup>
      {custom && (
        <>
          <span className={classes.to}>{t`to`}</span>
          <input
            value={customValue.LTE}
            className={classes.endDate}
            onChange={e => {
              e.persist();
              const newValue = { ...customValue, LTE: e.target.value };
              setAndUpdateValue(newValue);
            }}
            type="date"
          />
        </>
      )}
      <Menu
        id="time-range"
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={closeMenu}
      >
        {options.map(option => (
          <MenuItem
            key={option.value}
            onClick={select(option.value)}
            data-ga={`MenuItem(${option.value})`}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

TimeRange.displayName = 'TimeRange';

export default TimeRange;
