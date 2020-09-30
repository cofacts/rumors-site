import gql from 'graphql-tag';
import { ngettext, msgid } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { TYPE_ICON } from 'constants/replyType';
import Tooltip from 'components/Tooltip';

const useStyles = makeStyles(() => ({
  opinions: {
    display: 'flex',
  },
  opinion: {
    display: 'flex',
    alignItems: 'center',
    '&:not(:first-child)': {
      paddingLeft: 15,
    },
    '& > span:nth-child(2)': {
      paddingLeft: 4,
    },
  },
}));

function ReplyCountInfo({ normalArticleReplies }) {
  const classes = useStyles();

  const replyCount = normalArticleReplies.length;
  const opinions = normalArticleReplies.reduce((result, { replyType }) => {
    if (result[replyType]) {
      result[replyType] += 1;
    } else {
      result[replyType] = 1;
    }
    return result;
  }, {});

  return (
    <Tooltip
      title={
        replyCount === 0 ? (
          ''
        ) : (
          <div className={classes.opinions}>
            {Object.entries(opinions).map(([k, v]) => {
              const IconComponent = TYPE_ICON[k];
              return (
                <span key={k} className={classes.opinion}>
                  <IconComponent fontSize="inherit" />
                  <span>{v}</span>
                </span>
              );
            })}
          </div>
        )
      }
      arrow
    >
      <span>
        {ngettext(
          msgid`${replyCount} response`,
          `${replyCount} responses`,
          replyCount
        )}
      </span>
    </Tooltip>
  );
}

ReplyCountInfo.fragments = {
  ReplyCountInfo: gql`
    fragment NormalArticleReplyForReplyCountInfo on ArticleReply {
      replyType
    }
  `,
};

export default ReplyCountInfo;
