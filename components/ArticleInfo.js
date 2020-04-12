import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import { TYPE_ICON } from 'constants/replyType';

const useStyles = makeStyles(theme => ({
  info: {
    color: theme.palette.secondary[200],
    '&:not(:first-child)': {
      marginLeft: 6,
      paddingLeft: 6,
      borderLeft: `1px solid ${theme.palette.secondary[200]}`,
    },
  },
  opinion: {
    '&:not(:first-child)': {
      paddingLeft: 15,
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
export default function ArticleInfo({ article }) {
  const createdAt = new Date(article.createdAt);
  const { replyRequestCount, replyCount } = article;
  const timeAgoStr = formatDistanceToNow(createdAt);

  const opinions = (
    article?.articleReplies.map(({ reply }) => reply.type) || []
  ).reduce((result, current) => {
    if (result[current]) {
      result[current] += 1;
    } else {
      result[current] = 1;
    }
    return result;
  }, {});

  const classes = useStyles();

  return (
    <div>
      <span className={classes.info}>
        {ngettext(
          msgid`${replyRequestCount} occurence`,
          `${replyRequestCount} occurences`,
          replyRequestCount
        )}
      </span>

      {article.replyCount > 0 && (
        <CustomTooltip
          title={
            <>
              {Object.entries(opinions).map(([k, v]) => (
                <span key={k} className={classes.opinion}>
                  {TYPE_ICON[k]} {v}
                </span>
              ))}
            </>
          }
          arrow
        >
          <span className={classes.info}>
            {ngettext(
              msgid`${replyCount} response`,
              `${replyCount} responses`,
              replyCount
            )}
          </span>
        </CustomTooltip>
      )}
      {isValid(createdAt) && (
        <CustomTooltip title={format(createdAt)} arrow>
          <span className={classes.info}>{t`${timeAgoStr} ago`}</span>
        </CustomTooltip>
      )}
    </div>
  );
}

ArticleInfo.fragments = {
  articleInfo: gql`
    fragment ArticleInfo on Article {
      replyRequestCount
      replyCount
      createdAt
    }
  `,
};
