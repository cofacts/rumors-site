import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import BaseFilter from './BaseFilter';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

/**
 * URL param name to read from and write to
 */
const PARAM_NAME = 'articleTypes';

const OPTIONS = [
  { value: 'TEXT', label: t`Text` },
  { value: 'IMAGE', label: t`Image` },
  { value: 'VIDEO', label: t`Video` },
  { value: 'AUDIO', label: t`Audio` },
];

/**
 * @param {object} query - query from router
 * @returns {Arary<keyof TYPE_NAME>} list of selected reply types; see constants/replyType for all possible values
 */
function getValues(query) {
  return query[PARAM_NAME] ? query[PARAM_NAME].split(',') : [];
}

function ArticleTypeFilter() {
  const { query } = useRouter();
  const selectedValues = getValues(query);

  return (
    <BaseFilter
      title={t`Format`}
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

const MemoizedArticleTypeFilter = memo(ArticleTypeFilter);
MemoizedArticleTypeFilter.getValues = getValues;
export default MemoizedArticleTypeFilter;
