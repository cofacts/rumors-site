import Tooltip from 'components/Tooltip';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';

/**
 * Add tooltip and renders date in preferred format
 *
 * @param {Date} props.time
 * @param {(t: string) => string} props.children - Render of string
 */
function TimeInfo({ time, children = t => t }) {
  if (!isValid(time)) {
    return <>{children(String(time))}</>;
  }

  const timeAgoStr = formatDistanceToNow(time);

  return (
    <Tooltip title={format(time)}>
      <span>{children(timeAgoStr)}</span>
    </Tooltip>
  );
}

export default TimeInfo;
