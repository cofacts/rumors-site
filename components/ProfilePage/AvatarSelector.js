import { createElement, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { t } from 'ttag';
import { colorOptions, getBackgroundColor } from '../AppLayout/Widgets';
import { Hair, Face, FacialHair, BustPose, Accessories } from 'react-peeps';
import { Flip } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    margin: '1px',
  },
  inputClass: {
    border: `1px solid ${theme.palette.secondary[100]}`,
    background: ({ expand }) =>
      expand ? theme.palette.secondary[100] : theme.palette.common.white,
    transition: 'background .3s',
    borderRadius: 4,
    padding: '0px 10px',
    '& > svg': {
      display: 'none',
    },
    '& > div:focus': {
      background: 'initial',
    },
  },
  selectClass: {
    paddingRight: '0 !important',
    height: '1em',
    '& > svg': {
      display: 'none',
    },
  },
  menuItem: {
    display: 'table-cell',
  },
  avatarPiece: {
    height: 70,
    width: 70,
  },
  popoverRoot: {
    maxWidth: 580,
    width: 'calc(100% - 70px)',
    overflowX: 'scroll',
  },
  colorGird: {
    width: 20,
    height: 20,
    display: 'block',
    margin: 'auto',
  },
  colorPickerRoot: {
    display: 'inline-flex',
    margin: '1px',
  },
  flipButton: {
    display: 'inline-flex',
    margin: '1px',
    border: `1px solid ${theme.palette.secondary[100]}`,
    borderRadius: 4,
    padding: '2.5px 10px',
  },
  wrapper: {
    margin: 'auto',
    width: 'fit-content',
  },
}));

function ComponentInput({
  pieceType,
  anchorEl,
  selected,
  viewBox,
  title,
  onChange = () => {},
}) {
  const [expand, setExpand] = useState(false);
  const classes = useStyles({ expand });
  const options = Object.keys(pieceType);
  return (
    <>
      <TextField
        select
        classes={{ root: classes.root }}
        InputProps={{
          classes: {
            root: classes.inputClass,
          },
          disableUnderline: true,
        }}
        SelectProps={{
          classes: {
            root: classes.selectClass,
          },
          onOpen: () => setExpand(true),
          onClose: () => setExpand(false),
          renderValue: () => <span>{title}</span>, // eslint-disable-line react/display-name
          value: selected,
          MenuProps: {
            PopoverClasses: {
              paper: classes.popoverRoot,
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: 'center',
              horizontal: 'center',
            },
            anchorEl,
          },
          SelectDisplayProps: {
            test: 'test',
          },
        }}
        onChange={e => onChange(e.target.value)}
        disabled={options.length === 0}
      >
        {options.map(value => (
          <MenuItem key={value} value={value} className={classes.menuItem}>
            <svg className={classes.avatarPiece} viewBox={viewBox}>
              {value && pieceType && createElement(pieceType[value])}
            </svg>
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}

function ColorPicker({ options, anchorEl, selected, onChange = () => {} }) {
  const [expand, setExpand] = useState(false);
  const classes = useStyles({ expand });
  return (
    <>
      <TextField
        select
        classes={{ root: classes.colorPickerRoot }}
        InputProps={{
          classes: {
            root: classes.inputClass,
          },
          disableUnderline: true,
        }}
        SelectProps={{
          classes: {
            root: classes.selectClass,
          },
          onOpen: () => setExpand(true),
          onClose: () => setExpand(false),
          value: selected,
          MenuProps: {
            PopoverClasses: {
              paper: classes.popoverRoot,
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: 'center',
              horizontal: 'center',
            },
            anchorEl,
          },
          SelectDisplayProps: {
            test: 'test',
          },
        }}
        onChange={e => onChange(e.target.value)}
        disabled={options.length === 0}
      >
        {options.map(value => (
          <MenuItem key={value} value={value} className={classes.menuItem}>
            <span
              className={classes.colorGird}
              style={{ background: value }}
            ></span>
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}

const pieces = [
  {
    pieceType: Accessories,
    type: 'accessory',
    viewBox: '-75 -125 500 400',
    title: t`Accessory`,
  },
  {
    pieceType: BustPose,
    type: 'body',
    viewBox: '0 150 1200 1200',
    title: t`Body`,
  },
  {
    pieceType: Face,
    type: 'face',
    viewBox: '0 -20 300 400',
    title: t`Face`,
  },
  {
    pieceType: Hair,
    type: 'hair',
    viewBox: '0 -100 550 750',
    title: t`Hair`,
  },
  {
    pieceType: FacialHair,
    type: 'facialHair',
    viewBox: '-50 -100 500 400',
    title: t`Facial Hair`,
  },
];

function AvatarSelector({ avatarData, onChange }) {
  const wrapperEl = useRef(null);
  const classes = useStyles();

  return (
    <div ref={wrapperEl} className={classes.wrapper}>
      {pieces.map(({ pieceType, type, viewBox, title }) => (
        <ComponentInput
          key={type}
          pieceType={pieceType}
          anchorEl={() => wrapperEl.current}
          onChange={value => onChange(type, value)}
          selected={avatarData[type]}
          viewBox={viewBox}
          title={title}
        />
      ))}
      <Button
        className={classes.flipButton}
        onClick={() => onChange('flip', !avatarData?.flip)}
      >
        <Flip />
      </Button>
      <ColorPicker
        selected={getBackgroundColor({ avatarData })}
        options={colorOptions}
        anchorEl={() => wrapperEl.current}
        onChange={value => onChange('backgroundColor', value)}
      />
    </div>
  );
}

export default AvatarSelector;
