import { t } from 'ttag';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SortIcon from '@material-ui/icons/Sort';

export const DEFAULT_ORDER_BY = 'lastRequestedAt';

function SortInput({ orderBy = DEFAULT_ORDER_BY, onChange = () => {} }) {
  return (
    <TextField
      label={t`Sort by`}
      select
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SortIcon />
          </InputAdornment>
        ),
      }}
      value={orderBy}
      onChange={e => onChange(e.target.value)}
    >
      <MenuItem value="lastRequestedAt">{t`Most recently asked`}</MenuItem>
      <MenuItem value="lastRepliedAt">{t`Most recently replied`}</MenuItem>
      <MenuItem value="replyRequestCount">{t`Most asked`}</MenuItem>
    </TextField>
  );
}

export default SortInput;
