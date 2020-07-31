import Tooltip from 'components/Tooltip';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';

/**
 * Add tooltip and renders date in preferred format
 *
 * @param {Date | string | number} props.time
 * @param {(t: string) => React.ReactChild} props.children - Render of string
 */
function TimeInfo({ time, children = t => t }) {
  const date = time instanceof Date ? time : new Date(time);

  if (!time || !isValid(date)) {
    // `time` may be falsy something not accepted by Date constructor.
    // Try rendering it anyway.
    //
    return <>{children(String(time))}</>;
  }

  const timeAgoStr = formatDistanceToNow(date);

  return (
    <Tooltip title={format(date)}>
      <span>{children(timeAgoStr)}</span>
    </Tooltip>
  );
}

export default TimeInfo;
