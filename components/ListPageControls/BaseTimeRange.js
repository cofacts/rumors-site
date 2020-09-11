import { useRef, useState, forwardRef } from 'react';
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
    display: 'flex', // Override ButtonGroup default inline-flex
    flex: 1,
  },
  calendarButton: {
    background: theme.palette.common.white,
    borderColor: theme.palette.secondary[100],
    padding: 5,
    [theme.breakpoints.up('md')]: {
      padding: 8,
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
    flex: 1,
    background: theme.palette.common.white,
    padding: '0px 8px',
  },
  startDate: {
    flex: 1,
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
    flex: 1,
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

export const options = [
  { value: 'all', label: c('Time range dropdown').t`All` },
  { value: 'now-1d/d', label: t`In 1 Day` },
  { value: 'now-1w/d', label: t`In 1 Week` },
  { value: 'now-1M/d', label: t`In 1 Month` },
  { value: 'custom', label: c('Time range dropdown').t`Custom` },
];

/**
 * @param {string?} start
 * @param {string?} end
 * @return {string} one of options' value
 */
function getSelectedValue(start, end) {
  if (start === undefined && end === undefined) return 'all';
  if (end !== undefined) return 'custom';

  const option = options.find(o => o.value === start);
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

/**
 * Controlled input of time range
 *
 * @param {string?} props.start - ISO date (YYYY-MM-DD) or relative date format supported by Elasticsearch.
 * @param {string?} props.end - ISO date (YYYY-MM-DD) or relative date format supported by Elasticsearch.
 * @param {(start: string, end: string) => void} onChange
 */
function BaseTimeRange({ start, end, onChange = () => null }) {
  const [anchor, setAnchor] = useState(null);
  const anchorEl = useRef(null);
  const classes = useStyles();

  const openMenu = () => setAnchor(anchorEl.current);
  const closeMenu = () => setAnchor(null);
  const select = option => () => {
    switch (option) {
      case 'all':
        onChange(undefined, undefined);
        break;
      case 'custom':
        onChange('', '');
        break;
      default:
        onChange(option, undefined);
    }
    closeMenu();
  };

  const selectedValue = getSelectedValue(start, end);
  const isCustom = selectedValue === 'custom';

  return (
    <div className={classes.root}>
      <ButtonGroup className={classes.buttonGroup}>
        <Button className={classes.calendarButton} onClick={openMenu}>
          <DateRangeIcon className={classes.calendarIcon} />
        </Button>
        {isCustom ? (
          <Input
            ref={anchorEl}
            value={start}
            className={classes.startDate}
            onChange={e => {
              onChange(e.target.value, end);
            }}
            type="date"
          />
        ) : (
          <Button
            className={classes.selectButton}
            ref={anchorEl}
            onClick={openMenu}
          >
            {options.find(option => option.value === selectedValue).label}
          </Button>
        )}
      </ButtonGroup>
      {isCustom && (
        <>
          <span className={classes.to}>{t`to`}</span>
          <input
            value={end}
            className={classes.endDate}
            onChange={e => {
              onChange(start, e.target.value);
            }}
            type="date"
          />
        </>
      )}
      <Menu
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

export default BaseTimeRange;
