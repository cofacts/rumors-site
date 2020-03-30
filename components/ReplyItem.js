import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import gql from 'graphql-tag';
import { t } from 'ttag';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import isValid from 'date-fns/isValid';
import { TYPE_NAME } from '../constants/replyType';
import Avatar from 'components/AppLayout/Widgets/Avatar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

/**
 *
 * @param {ReplyItem} props.reply - see ReplyItem in GraphQL fragment
 * @param {boolean} showUser
 */
function ReplyItem({ reply }) {
  const { user, type: replyType } = reply;
  const createdAt = new Date(reply.createdAt);
  const timeAgoStr = formatDistanceToNow(createdAt);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box p="24px">
        <Avatar user={user} size={72} />
        {/*
          <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        */}
      </Box>
      <Box py="12px">
        <div>{t`${user.name} consider this ${TYPE_NAME[replyType]}`}</div>
        <div>{reply.text}</div>
        <div>
          {isValid(createdAt) || (
            <span title={format(createdAt)}>{t`${timeAgoStr} ago`}</span>
          )}
        </div>
      </Box>
    </div>
  );
}

ReplyItem.fragments = {
  ReplyItem: gql`
    fragment ReplyItem on Reply {
      id
      text
      type
      createdAt
      user {
        id
        name
      }
      articleReplies(status: NORMAL) {
        articleId
        replyId
      }
    }
  `,
};

export default ReplyItem;
