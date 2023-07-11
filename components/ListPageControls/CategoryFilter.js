import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { goToUrlQueryAndResetPagination } from 'lib/listPage';
import BaseFilter from './BaseFilter';

/**
 * URL param name to read from and write to
 */
const PARAM_NAME = 'categoryIds';

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

/**
 * @param {object} query - query from router
 * @returns {string[]} list of category ids
 */
function getValues(query) {
  return query[PARAM_NAME] ? query[PARAM_NAME].split(',') : [];
}

function CategoryFilter() {
  const { query } = useRouter();
  const { data } = useQuery(LIST_CATEGORIES, {
    ssr: false, // No need to fetch on server
  });

  const selectedValues = getValues(query);
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
      onChange={(values) =>
        goToUrlQueryAndResetPagination({
          ...query,
          [PARAM_NAME]: values.join(','),
        })
      }
      data-ga="Filter(category)"
    />
  );
}

const MemoizedCategoryFilter = memo(CategoryFilter);
MemoizedCategoryFilter.getValues = getValues;
export default MemoizedCategoryFilter;
