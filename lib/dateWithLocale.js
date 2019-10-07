import dateFnsFormat from 'date-fns/format';
import dateFnsFormatDistanceToNow from 'date-fns/formatDistanceToNow';

const localeStr = process.env.LOCALE || 'en_US';
const locale = require(`date-fns/locale/${localeStr.replace('_', '-')}`);

export function format(date, format = 'Pp') {
  return dateFnsFormat(date, format, { locale });
}

export function formatDistanceToNow(date, config = {}) {
  return dateFnsFormatDistanceToNow(date, { ...config, locale });
}
