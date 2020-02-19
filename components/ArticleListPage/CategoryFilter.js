import { t } from 'ttag';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

export const DEFAULT_CATEGORY_IDS = [];

/**
 * @param {string[]} props.categoryIds - selected category id
 * @param {Category[]} props.categories - category options
 * @param {(categoryIds: string[]) => void} props.onChange
 */
function CategoryFilter({
  categoryIds = DEFAULT_CATEGORY_IDS,
  categories = [],
  onChange = () => {},
}) {
  return (
    <TextField
      label={t`Category`}
      select
      SelectProps={{
        multiple: true,
        renderValue: selectedIds =>
          selectedIds
            .map(id => categories.find(category => category.id === id)?.title)
            .filter(c => c)
            .join(', '),
      }}
      value={categoryIds}
      onChange={e => onChange(e.target.value)}
    >
      {categories.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          <Checkbox checked={categoryIds.includes(id)} />
          <ListItemText>{title}</ListItemText>
        </MenuItem>
      ))}
    </TextField>
  );
}

export default CategoryFilter;
