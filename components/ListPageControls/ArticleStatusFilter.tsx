import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import { ParsedUrlQuery } from 'querystring';

import { ListArticleFilter } from 'typegen/graphql';
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
  { value: FILTERS.HAS_USEFUL_REPLY, label: t`Has useful replies` },
  { value: FILTERS.REPLIED_BY_ME, label: t`Replied by me` },
  { value: FILTERS.NOT_REPLIED_BY_ME, label: t`Not replied by me` },
];

/** Filters that is only enabled when user is logged in */
const LOGIN_ONLY_OPTIONS = [FILTERS.REPLIED_BY_ME, FILTERS.NOT_REPLIED_BY_ME];

const MUTUALLY_EXCLUSIVE_FILTERS: ReadonlyArray<
  ReadonlyArray<keyof typeof FILTERS>
> = [
  // Sets of filters that are mutually exclusive (cannot be selected together)
  [FILTERS.ASKED_ONCE, FILTERS.ASKED_MANY_TIMES],
  [FILTERS.NO_REPLY, FILTERS.REPLIED_MANY_TIMES],
  [FILTERS.NO_USEFUL_REPLY_YET, FILTERS.HAS_USEFUL_REPLY],
  [FILTERS.REPLIED_BY_ME, FILTERS.NOT_REPLIED_BY_ME],
];

/**
 * @param query - query from router
 * @returns list of selected filter values; see constants/articleFilters for all possible values
 */
export function getValues(query: ParsedUrlQuery): Array<keyof typeof FILTERS> {
  return query[PARAM_NAME]
    ? query[PARAM_NAME].toString()
        .split(',')
        .filter((param): param is keyof typeof FILTERS => param in FILTERS)
    : [];
}

/**
 * @param query - query from router
 * @param userId - currently logged in user ID. Can be undefined if not logged in.
 * @returns a ListArticleFilter with filter fields from router query
 */
export function getFilter(
  query: ParsedUrlQuery,
  userId?: string
): ListArticleFilter {
  const filterObj: ListArticleFilter = {};

  for (const filter of getValues(query)) {
    // Skip login only filters when user is not logged in
    if (!userId && LOGIN_ONLY_OPTIONS.includes(filter)) break;

    switch (filter) {
      case FILTERS.REPLIED_BY_ME:
        filterObj.articleRepliesFrom = {
          userId: userId,
          exists: true,
        };
        break;
      case FILTERS.NOT_REPLIED_BY_ME:
        filterObj.articleRepliesFrom = {
          userId: userId,
          exists: false,
        };
        break;
      case FILTERS.NO_USEFUL_REPLY_YET:
        filterObj.hasArticleReplyWithMorePositiveFeedback = false;
        break;
      case FILTERS.HAS_USEFUL_REPLY:
        filterObj.hasArticleReplyWithMorePositiveFeedback = true;
        break;
      case FILTERS.ASKED_ONCE:
        filterObj.replyRequestCount = { EQ: 1 };
        break;
      case FILTERS.ASKED_MANY_TIMES:
        filterObj.replyRequestCount = { GTE: 2 };
        break;
      case FILTERS.NO_REPLY:
        filterObj.replyCount = { EQ: 0 };
        break;
      case FILTERS.REPLIED_MANY_TIMES:
        filterObj.replyCount = { GTE: 3 };
        break;
      default: {
        const exhaustiveCheck: never = filter;
        throw new Error(`Unhandled case: ${exhaustiveCheck}`);
      }
    }
  }

  return filterObj;
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
  let options = OPTIONS.filter((f) => filterMap[f.value] !== false);

  if (!user) {
    options = options.map((option) => ({
      ...option,
      disabled: LOGIN_ONLY_OPTIONS.includes(option.value),
    }));
  }

  return (
    <BaseFilter
      title={t`Filter`}
      options={options}
      selected={selectedValues}
      onChange={(newValues) => {
        MUTUALLY_EXCLUSIVE_FILTERS.forEach((mutuallyExclusiveFilters) => {
          for (const filter of mutuallyExclusiveFilters) {
            if (
              !selectedValues.includes(filter) &&
              newValues.includes(filter)
            ) {
              // This filter is being toggled on;
              // remove others in the same mutually exclusive filters set
              newValues = newValues.filter((v) =>
                mutuallyExclusiveFilters.includes(v) ? v === filter : true
              );

              // Found the toggled filter, can skip the rest.
              break;
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
