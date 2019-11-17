import { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

function SearchInput({ q = '', onChange = () => {} }) {
  const handleSubmit = useCallback(e => onChange(e.target.value), [onChange]);
  const handleKeyUp = useCallback(e => {
    e.which === 13 && e.target.blur();
  }, []);

  return (
    <TextField
      defaultValue={q}
      onBlur={handleSubmit}
      onKeyUp={handleKeyUp}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchInput;
