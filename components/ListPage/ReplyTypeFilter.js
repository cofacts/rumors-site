import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import BaseFilter from './BaseFilter';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

import { TYPE_NAME } from 'constants/replyType';

const OPTIONS = Object.entries(TYPE_NAME).map(([value, label]) => ({
  value,
  label,
}));

function ReplyTypeFilter() {
  const { query } = useRouter();
  const selectedValues = query.types ? query.types.split(',') : [];

  return (
    <BaseFilter
      title={t`Marked as`}
      selected={selectedValues}
      options={OPTIONS}
      onChange={selected =>
        goToUrlQueryAndResetPagination({
          ...query,
          types: selected.join(','),
        })
      }
    />
  );
}

export default memo(ReplyTypeFilter);
