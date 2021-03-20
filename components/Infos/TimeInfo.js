import Tooltip from 'components/Tooltip';
import isValid from 'date-fns/isValid';
import { useEffect, useState } from 'react';

const locale = (process.env.LOCALE || 'en_US').replace('_', '-');

/**
 * Formats date as an absolute time, using local timezone.
 * Year will be omitted unless different from current year or forceYear = true.
 */
function formatDateAbsolute(date, { forceYear = false } = {}) {
  const now = new Date();

  let options = {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
  };
  if (now.getFullYear() != date.getFullYear() || forceYear) {
    options.year = 'numeric';
  }

  const dtf = new Intl.DateTimeFormat(locale, options);
  return dtf.format(date);
}

/**
 * Formats date as a relative time (e.g. X days ago).
 * Works best if date is in the past.
 */
function formatDateRelative(date) {
  const rtf = new Intl.RelativeTimeFormat(locale, { style: 'narrow' });
  const now = new Date();
  const minsAgo = (now - date) / 1000 / 60;
  const hoursAgo = minsAgo / 60;

  if (minsAgo < 1) {
    return 'less than a minute ago';
  }
  // "60 min. ago" and "1 hr. ago" mean the same thing, so if 59.5 <= minsAgo < 90 we display "1 hr. ago".
  if (minsAgo < 59.5) {
    return rtf.format(-Math.round(minsAgo), 'minutes');
  }
  // Similar to above, use a cutoff of 23.5 hours.
  if (hoursAgo < 23.5) {
    return rtf.format(-Math.round(hoursAgo), 'hours');
  }
  return rtf.format(-Math.round(hoursAgo / 24), 'days');
}

/**
 * Formats the date as a relative time if within 23.5 hours, otherwise formats as an absolute time.
 */
function formatDate(date) {
  const hoursAgo = (new Date() - date) / 1000 / 60 / 60;
  if (hoursAgo < 23.5) {
    return formatDateRelative(date);
  } else {
    return formatDateAbsolute(date);
  }
}

/**
 * Add tooltip and renders date in preferred format
 *
 * @param {Date | string | number} props.time
 * @param {(t: string) => React.ReactChild} props.children - Render of string
 */
function TimeInfo({ time, children = t => t }) {
  const date = time instanceof Date ? time : new Date(time);
  const dateIsValid = time && isValid(date);

  const [timeAgoStr, setTimeAgoStr] = useState(
    dateIsValid ? formatDateRelative(date) : String(time)
  );

  // The client and the server may have different timezones, so when we render on the server, we always use relative
  // time (because it does not depend on timezone). When we re-render on the client, we replace this with an absolute
  // time where appropriate. We do this replacement in useEffect() because it runs on the client but not on the server.
  useEffect(() => {
    if (dateIsValid) {
      setTimeAgoStr(formatDate(date));
    }
  }, [date, dateIsValid]);

  if (!dateIsValid) {
    // `time` may be falsy something not accepted by Date constructor.
    // Try rendering it anyway.
    //
    return <>{children(String(time))}</>;
  }

  return (
    <Tooltip title={formatDateAbsolute(date, { forceYear: true })}>
      <time dateTime={date.toISOString()}>{children(timeAgoStr)}</time>
    </Tooltip>
  );
}

export default TimeInfo;
