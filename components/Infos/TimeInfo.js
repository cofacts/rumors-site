import Tooltip from 'components/Tooltip';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';

/**
 * Formats the date as a relative time if within 24 hours, otherwise formats as an absolute time.
 */
function formatTimeInfoDate(date) {
  const now = new Date();
  const rtf = new Intl.RelativeTimeFormat('en-US', { style: 'narrow' });
  const dtf = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const minsAgo = (now - date) / 1000 / 60;
  const hoursAgo = minsAgo / 60;

  if (minsAgo < 1) {
    return "less than a minute ago"
  }
  // "60 min. ago" and "1 hr. ago" mean the same thing, so if 59.5 <= minsAgo < 90 we display "1 hr. ago".
  if (minsAgo < 59.5) {
    return rtf.format(-Math.round(minsAgo), "minutes");
  }
  if (hoursAgo < 24) {
    return rtf.format(-Math.round(hoursAgo), "hours");
  }
  return dtf.format(date);
}

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

  const timeAgoStr = formatTimeInfoDate(date);

  return (
    <Tooltip title={format(date)}>
      <span>{children(timeAgoStr)}</span>
    </Tooltip>
  );
}

export default TimeInfo;
