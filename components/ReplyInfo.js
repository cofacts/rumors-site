import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';

const useStyles = makeStyles(theme => ({
  info: {
    color: theme.palette.secondary[200],
    '&:not(:first-child)': {
      marginLeft: 6,
      paddingLeft: 6,
      borderLeft: `1px solid ${theme.palette.secondary[200]}`,
    },
  },
}));

const CustomTooltip = withStyles(theme => ({
  arrow: {
    color: theme.palette.secondary[500],
  },
  tooltip: {
    backgroundColor: theme.palette.secondary[500],
  },
}))(Tooltip);

export default function ReplyInfo({ reply, articleReplyCreatedAt }) {
  const createdAt = articleReplyCreatedAt
    ? new Date(articleReplyCreatedAt)
    : new Date();
  const { articleReplies, user } = reply;
  const referenceCount = articleReplies?.length;
  const timeAgoStr = formatDistanceToNow(createdAt);

  const classes = useStyles();

  return (
    <div>
      {isValid(createdAt) && (
        <CustomTooltip title={format(createdAt)} arrow>
          <span className={classes.info}>{t`replied ${timeAgoStr} ago`}</span>
        </CustomTooltip>
      )}
      {user && (
        <span
          className={classes.info}
        >{t`originally written by ${user.name}`}</span>
      )}

      {referenceCount > 0 && (
        <span className={classes.info}>
          {ngettext(
            msgid`${referenceCount} reference`,
            `${referenceCount} references`,
            referenceCount
          )}
        </span>
      )}
    </div>
  );
}

ReplyInfo.fragments = {
  replyInfo: gql`
    fragment ReplyInfo on Reply {
      id
      createdAt
      user {
        id
        name
      }
    }
  `,
};
