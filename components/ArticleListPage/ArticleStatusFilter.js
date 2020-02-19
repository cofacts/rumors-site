import { t } from 'ttag';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

export const DEFAULT_STATUS_FILTER = 'unsolved';

function ArticleStatusFilter({
  filter = DEFAULT_STATUS_FILTER,
  onChange = () => {},
}) {
  return (
    <ButtonGroup size="small" variant="outlined">
      <Button
        disabled={filter === 'unsolved'}
        onClick={() => onChange('unsolved')}
      >
        {t`Not replied`}
      </Button>
      <Button disabled={filter === 'solved'} onClick={() => onChange('solved')}>
        {t`Replied`}
      </Button>
      <Button disabled={filter === 'all'} onClick={() => onChange('all')}>
        {t`All`}
      </Button>
    </ButtonGroup>
  );
}

export default ArticleStatusFilter;
