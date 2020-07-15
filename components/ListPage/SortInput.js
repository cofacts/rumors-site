import { memo } from 'react';
import { useRouter } from 'next/router';
import BaseSortInput from './BaseSortInput';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

/**
 * URL param name to read from and write to
 */
const PARAM_NAME = 'orderBy';

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
      onChange={orderBy => {
        goToUrlQueryAndResetPagination({ ...query, [PARAM_NAME]: orderBy });
      }}
    />
  );
}

export default memo(SortInput);
