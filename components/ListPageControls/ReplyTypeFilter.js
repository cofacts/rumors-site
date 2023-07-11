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

/**
 * @param {object} query - query from router
 * @returns {Arary<keyof TYPE_NAME>} list of selected reply types; see constants/replyType for all possible values
 */
function getValues(query) {
  return query[PARAM_NAME] ? query[PARAM_NAME].split(',') : [];
}

function ReplyTypeFilter() {
  const { query } = useRouter();
  const selectedValues = getValues(query);

  return (
    <BaseFilter
      title={t`Marked as`}
      selected={selectedValues}
      options={OPTIONS}
      onChange={(selected) =>
        goToUrlQueryAndResetPagination({
          ...query,
          [PARAM_NAME]: selected.join(','),
        })
      }
    />
  );
}

const MemoizedReplyTypeFilter = memo(ReplyTypeFilter);
MemoizedReplyTypeFilter.getValues = getValues;
export default MemoizedReplyTypeFilter;
