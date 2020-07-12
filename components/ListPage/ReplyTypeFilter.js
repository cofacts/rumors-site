import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import BaseFilter from './BaseFilter';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

import { TYPE_NAME } from 'constants/replyType';

/**
 * URL param name to read from and write to
 */
const PARAM_NAME = 'types';

const OPTIONS = Object.entries(TYPE_NAME).map(([value, label]) => ({
  value,
  label,
}));

function ReplyTypeFilter() {
  const { query } = useRouter();
  const selectedValues = query[PARAM_NAME] ? query[PARAM_NAME].split(',') : [];

  return (
    <BaseFilter
      title={t`Marked as`}
      selected={selectedValues}
      options={OPTIONS}
      onChange={selected =>
        goToUrlQueryAndResetPagination({
          ...query,
          [PARAM_NAME]: selected.join(','),
        })
      }
    />
  );
}

export default memo(ReplyTypeFilter);
