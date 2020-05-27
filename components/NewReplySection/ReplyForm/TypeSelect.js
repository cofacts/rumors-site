import { withStyles } from '@material-ui/core/styles';
import { Box, NativeSelect, InputBase } from '@material-ui/core';
import { TYPE_NAME, TYPE_DESC } from 'constants/replyType';
import Hint from './Hint';

const CustomInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

export default function TypeSelect({ replyType, onChange }) {
  return (
    <Box display="flex" alignItems="center">
      <Box component="span" pr={1}>{`I think this message`}</Box>
      <NativeSelect
        name="type"
        value={replyType}
        onChange={onChange}
        input={<CustomInput />}
      >
        {['NOT_ARTICLE', 'OPINIONATED', 'NOT_RUMOR', 'RUMOR'].map(type => (
          <option key={type} value={type}>
            {TYPE_NAME[type]}
          </option>
        ))}
      </NativeSelect>
      <Box display={{ xs: 'none', md: 'block' }} px={1} flex={1}>
        <Hint>{TYPE_DESC[replyType]}</Hint>
      </Box>
    </Box>
  );
}
