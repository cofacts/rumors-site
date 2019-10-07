import dateFnsFormat from 'date-fns/format';
import dateFnsFormatDistanceToNow from 'date-fns/formatDistanceToNow';

const locale = require(`date-fns/locale/${(
  process.env.LOCALE || 'en_US'
).replace('_', '-')}`);

export function format(date, format = 'Pp') {
  return dateFnsFormat(date, format, { locale });
}

export function formatDistanceToNow(date, config = {}) {
  return dateFnsFormatDistanceToNow(date, { ...config, locale });
}
