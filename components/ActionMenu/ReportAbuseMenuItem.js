import { t } from 'ttag';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import { getSpamReportUrl } from 'constants/urls';
import useCurrentUser from 'lib/useCurrentUser';

const useStyles = makeStyles({
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
});

/**
 *
 * @param {string} itemUserId - the author's user ID of the item
 */
export function useCanReportAbuse(itemUserId) {
  const currentUser = useCurrentUser();
  return currentUser && currentUser.id !== itemUserId;
}

/**
 * @param {object} props
 * @param {string} props.userId - spammer's user ID
 * @param {'replyRequest' | 'articleReplyFeedback' | 'reply'} props.itemType - reported spam item type
 * @param {string} props.itemId - reply ID for reply; article ID for replyRequest; article ID,reply ID (separated in comma) for article reply feedback.
 *
 * @returns {string} Pre-filled URL to the google form that reports spam.
 */
function ReportAbuseMenuItem(props) {
  const classes = useStyles();
  const canReportAbuse = useCanReportAbuse(props.userId);

  if (!canReportAbuse) return null;

  return (
    <a
      className={classes.link}
      href={getSpamReportUrl(props)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MenuItem>{t`Report abuse`}</MenuItem>
    </a>
  );
}

export default ReportAbuseMenuItem;
