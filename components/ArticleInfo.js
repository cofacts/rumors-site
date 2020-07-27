import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import Tooltip from './Tooltip';
import { makeStyles } from '@material-ui/core/styles';
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
    display: 'flex',
    alignItems: 'center',
    '&:not(:first-child)': {
      paddingLeft: 15,
    },
    '& > span:nth-child(2)': {
      paddingLeft: 4,
    },
  },
  optionIcon: {
    fontSize: 14,
  },
}));

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
          msgid`${replyRequestCount} occurrence`,
          `${replyRequestCount} occurrences`,
          replyRequestCount
        )}
      </span>

      {article.replyCount > 0 && (
        <Tooltip
          title={
            <>
              {Object.entries(opinions).map(([k, v]) => {
                const IconComponent = TYPE_ICON[k];
                return (
                  <span key={k} className={classes.opinion}>
                    <IconComponent className={classes.optionIcon} />
                    <span>{v}</span>
                  </span>
                );
              })}
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
        </Tooltip>
      )}
      {isValid(createdAt) && (
        <Tooltip title={format(createdAt)} arrow>
          <span className={classes.info}>{t`${timeAgoStr} ago`}</span>
        </Tooltip>
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
      articleReplies(status: NORMAL) {
        reply {
          type
        }
      }
    }
  `,
};
