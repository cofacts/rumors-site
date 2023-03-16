import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import { ParsedUrlQuery } from 'querystring';

import BaseFilter from './BaseFilter';
import useCurrentUser from 'lib/useCurrentUser';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

import * as FILTERS from 'constants/articleFilters';

/**
 * URL param name to read from and write to
 */
const PARAM_NAME = 'filters';

const OPTIONS = [
  { value: FILTERS.ASKED_ONCE, label: t`Asked only once` },
  { value: FILTERS.ASKED_MANY_TIMES, label: t`Asked many times` },
  { value: FILTERS.NO_REPLY, label: t`Zero replies` },
  { value: FILTERS.REPLIED_MANY_TIMES, label: t`Replied many times` },
  { value: FILTERS.NO_USEFUL_REPLY_YET, label: t`No useful reply yet` },
  { value: FILTERS.REPLIED_BY_ME, label: t`Replied by me` },
];

const LOGIN_ONLY_OPTIONS = [FILTERS.REPLIED_BY_ME];

const MUTUALLY_EXCLUSIVE_FILTERS: ReadonlyArray<
  ReadonlyArray<keyof typeof FILTERS>
> = [
  // Sets of filters that are mutually exclusive (cannot be selected together)
  [FILTERS.ASKED_ONCE, FILTERS.ASKED_MANY_TIMES],
  [FILTERS.NO_REPLY, FILTERS.REPLIED_MANY_TIMES],
];

/**
 * @param {object} query - query from router
 * @returns {Arary<keyof FILTERS>} list of selected filter values; see constants/articleFilters for all possible values
 */
export function getValues(query: ParsedUrlQuery): Array<keyof typeof FILTERS> {
  return query[PARAM_NAME]
    ? query[PARAM_NAME].toString()
        .split(',')
        .filter((param): param is keyof typeof FILTERS => param in FILTERS)
    : [];
}

type Props = {
  /** setting FILTERS.XXX false means that XXX option should be hidden in ArticleStatusFilter. */
  filterMap?: Partial<Record<keyof typeof FILTERS, boolean>>;
};

function ArticleStatusFilter({ filterMap = {} }: Props) {
  const { query } = useRouter();
  const user = useCurrentUser();
  const selectedValues = getValues(query);

  // Disable login-only options when not logged in
  let options = OPTIONS.filter(f => filterMap[f.value] !== false);

  if (user) {
    options = options.map(option => ({
      ...option,
      disabled: LOGIN_ONLY_OPTIONS.includes(option.value),
    }));
  }

  return (
    <BaseFilter
      title={t`Filter`}
      options={options}
      selected={selectedValues}
      onChange={newValues => {
        MUTUALLY_EXCLUSIVE_FILTERS.forEach(mutuallyExclusiveFilters => {
          for (const filter of mutuallyExclusiveFilters) {
            if (
              !selectedValues.includes(filter) &&
              newValues.includes(filter)
            ) {
              // This filter is being toggled on;
              // remove others in the same mutually exclusive filters set
              newValues = newValues.filter(v =>
                mutuallyExclusiveFilters.includes(v) ? v === filter : true
              );
            }
          }
        });

        goToUrlQueryAndResetPagination({
          ...query,
          [PARAM_NAME]: newValues.join(','),
        });
      }}
      data-ga="Filter(filter)"
    />
  );
}

export default memo(ArticleStatusFilter);
