import { memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import BaseFilter from './BaseFilter';
import useCurrentUser from 'lib/useCurrentUser';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

import * as FILTERS from 'constants/articleFilters';

const OPTIONS = [
  { value: FILTERS.REPLIED_BY_ME, label: t`Replied by me` },
  { value: FILTERS.NO_USEFUL_REPLY_YET, label: t`No useful reply yet` },
  { value: FILTERS.ASKED_MANY_TIMES, label: t`Asked many times` },
  { value: FILTERS.REPLIED_MANY_TIMES, label: t`Replied many times` },
];

const LOGIN_ONLY_OPTIONS = [FILTERS.REPLIED_BY_ME];

function ArticleStatusFilter() {
  const { query } = useRouter();
  const user = useCurrentUser();
  const selectedValues = query.filters ? query.filters.split(',') : [];

  // Disable login-only options when not logged in
  const options = user
    ? OPTIONS
    : OPTIONS.map(option => ({
        ...option,
        disabled: LOGIN_ONLY_OPTIONS.includes(option.value),
      }));

  return (
    <BaseFilter
      title={t`Filter`}
      options={options}
      selected={selectedValues}
      onChange={values =>
        goToUrlQueryAndResetPagination({
          ...query,
          filters: values.join(','),
        })
      }
      data-ga="Filter(filter)"
    />
  );
}

export default memo(ArticleStatusFilter);
