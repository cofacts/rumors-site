import dateFnsFormat from 'date-fns/format';
import dateFnsFormatDistanceToNow from 'date-fns/formatDistanceToNow';

const rawLocale =
  (typeof process !== 'undefined' &&
    process.env &&
    (process.env.LOCALE || process.env.NEXT_PUBLIC_LOCALE)) ||
  'en_US';

const locale = require(`date-fns/locale/${rawLocale.replace('_', '-')}`);

export function format(date, format = 'Pp') {
  return dateFnsFormat(date, format, { locale });
}

export function formatDistanceToNow(date, config = {}) {
  return dateFnsFormatDistanceToNow(date, { ...config, locale });
}
