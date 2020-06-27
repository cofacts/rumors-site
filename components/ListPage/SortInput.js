import { memo } from 'react';
import { useRouter } from 'next/router';
import BaseSortInput from './BaseSortInput';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

/**
 * @param {string} defaultOrderBy - Used when no order is specified in URL
 * @param {BaseSortInputProps['options']} props.options
 */
function SortInput({ options, defaultOrderBy }) {
  const { query } = useRouter();

  return (
    <BaseSortInput
      orderBy={query.orderBy || defaultOrderBy}
      options={options}
      onChange={orderBy => {
        goToUrlQueryAndResetPagination({ ...query, orderBy });
      }}
    />
  );
}

export default memo(SortInput);
