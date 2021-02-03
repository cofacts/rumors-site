import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import { t } from 'ttag';
import {accessories,
bustPoses,
faces,
hairStyles,
facialHairStyles} from '../AppLayout/Widgets'
const useStyles = makeStyles(theme => ({
  root: {
    // Override TextField's inline-flex to extend to whole container
    display: 'flex',
  },
  inputClass: {
    border: `1px solid ${theme.palette.secondary[100]}`,
    background: ({ expand }) =>
      expand ? theme.palette.secondary[100] : theme.palette.common.white,
    transition: 'background .3s',
    borderRadius: 4,
    padding: '0px 10px',
  },
  adornment: {
    '& > p': {
      fontSize: 14,
    },
  },
  selectClass: {
    fontSize: 14,
    '&:focus': {
      backgroundColor: 'inherit',
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: 2.5,
      paddingBottom: 2.5,
    },
  },
}));

/**
 * @param {string} props.orderBy
 * @param {(orderBy: string) => void} props.onChange
 * @param {Array<{value: string, label: React.ReactNode}>} props.options
 */
function ComponentInput({ selected = '', onChange = () => {}, options = [], title }) {
  const [expand, setExpand] = useState(false);
  const classes = useStyles({ expand });
  return (
    <TextField
      select
      classes={{ root: classes.root }}
      InputProps={{
        classes: {
          root: classes.inputClass,
        },
        disableUnderline: true,
        startAdornment: (
          <InputAdornment
            classes={{ root: classes.adornment }}
            position="start"
          >
            {title}
          </InputAdornment>
        ),
      }}
      SelectProps={{
        classes: {
          root: classes.selectClass,
        },
        onOpen: () => setExpand(true),
        onClose: () => setExpand(false),
      }}
      value={selected}
      onChange={e => onChange(e.target.value)}
      disabled={options.length === 0}
    >
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
}

function AvatarSelector({ avatarData }) {
  return (
  <div>
    <ComponentInput select={avatarData.accessory} options={accessories} title={t`Accessory`} />
    <ComponentInput select={avatarData.body} options={bustPoses} title={t`Body`} />
    <ComponentInput select={avatarData.face} options={faces} title={t`Face`} />
    <ComponentInput select={avatarData.hair} options={hairStyles} title={t`Hair Style`} />
    <ComponentInput select={avatarData.facialHair} options={facialHairStyles} title={t`Facial Hair Style`} />
  </div>)
}

export default AvatarSelector;
