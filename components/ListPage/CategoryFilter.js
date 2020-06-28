import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';

import { goToUrlQueryAndResetPagination } from 'lib/listPage';
import BaseFilter from './BaseFilter';

const LIST_CATEGORIES = gql`
  query ListCategories {
    ListCategories(first: 25) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

function CategoryFilter() {
  const { query } = useRouter();
  const { data } = useLazyQuery(LIST_CATEGORIES); // No need to fetch on server

  const selectedValues = query.categoryIds ? query.categoryIds.split(',') : [];
  const options =
    data?.ListCategories?.edges.map(({ node }) => ({
      chip: true,
      value: node.id,
      label: node.title,
    })) || [];

  return (
    <BaseFilter
      expandable
      title={t`Topic`}
      options={options}
      selected={selectedValues}
      placeholder={t`All Topics`}
      onChange={values =>
        goToUrlQueryAndResetPagination({
          ...query,
          categoryIds: values.join(','),
        })
      }
      data-ga="Filter(category)"
    />
  );
}

export default memo(CategoryFilter);
