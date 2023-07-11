import { memo } from 'react';
import { useRouter } from 'next/router';
import BaseSortInput from './BaseSortInput';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

/**
 * URL param name to read from and write to
 */
const PARAM_NAME = 'orderBy';

/**
 * @param {object} query - query from router
 * @returns {string?} selected sort option value; undefined when not exist
 */
function getValue(query) {
  return query[PARAM_NAME];
}

/**
 * @param {string} defaultOrderBy - Used when no order is specified in URL
 * @param {BaseSortInputProps['options']} props.options
 */
function SortInput({ options, defaultOrderBy }) {
  const { query } = useRouter();

  return (
    <BaseSortInput
      orderBy={query[PARAM_NAME] || defaultOrderBy}
      options={options}
      onChange={(orderBy) => {
        goToUrlQueryAndResetPagination({ ...query, [PARAM_NAME]: orderBy });
      }}
    />
  );
}

const MemoizedSortInput = memo(SortInput);
MemoizedSortInput.getValue = getValue;
export default MemoizedSortInput;
