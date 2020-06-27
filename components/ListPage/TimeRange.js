import { memo } from 'react';
import { useRouter } from 'next/router';
import BaseTimeRange from './BaseTimeRange';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

/**
 * Time range control connnected to URL "start", "end" param
 */
function TimeRange() {
  const { query } = useRouter();

  return (
    <BaseTimeRange
      start={query.start}
      end={query.end}
      onChange={(start, end) => {
        goToUrlQueryAndResetPagination({
          ...query,
          start,
          end,
        });
      }}
    />
  );
}

export default memo(TimeRange);
