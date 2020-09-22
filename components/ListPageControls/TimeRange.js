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
 * @param {object} query - query from router
 * @returns {[string?, string?]} Pair of timestamps representing [start, end].
 *    Strings are in ISO date (YYYY-MM-DD) or relative date format supported by Elasticsearch.
 *    When not specified, it's undefined.
 */
function getValues(query) {
  return [query[PARAM_NAME_START], query[PARAM_NAME_END]];
}

/**
 * Time range control connnected to URL "start", "end" param
 */
function TimeRange() {
  const { query } = useRouter();

  const [start, end] = getValues(query);

  return (
    <BaseTimeRange
      start={start}
      end={end}
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

const MemoizedTimeRange = memo(TimeRange);
MemoizedTimeRange.getValues = getValues;
export default MemoizedTimeRange;
