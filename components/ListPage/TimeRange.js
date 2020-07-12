import { memo } from 'react';
import { useRouter } from 'next/router';
import BaseTimeRange from './BaseTimeRange';
import { goToUrlQueryAndResetPagination } from 'lib/listPage';

/**
 * URL param names to read from and write to
 */
const PARAM_NAME_START = 'start';
const PARAM_NAME_END = 'end';

/**
 * Time range control connnected to URL "start", "end" param
 */
function TimeRange() {
  const { query } = useRouter();

  return (
    <BaseTimeRange
      start={query[PARAM_NAME_START]}
      end={query[PARAM_NAME_END]}
      onChange={(start, end) => {
        goToUrlQueryAndResetPagination({
          ...query,
          [PARAM_NAME_START]: start,
          [PARAM_NAME_END]: end,
        });
      }}
    />
  );
}

export default memo(TimeRange);
