import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { TYPE_ICON } from 'constants/replyType';
import Infos, { TimeInfo } from './Infos';
import Tooltip from './Tooltip';

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
  optionIcon: {
    fontSize: 14,
  },
}));

export default function ArticleInfo({ article }) {
  const createdAt = new Date(article.createdAt);
  const { replyRequestCount, replyCount } = article;

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
    <Infos>
      <>
        {ngettext(
          msgid`${replyRequestCount} occurrence`,
          `${replyRequestCount} occurrences`,
          replyRequestCount
        )}
      </>

      {article.replyCount > 0 && (
        <Tooltip
          title={
            <div className={classes.opinions}>
              {Object.entries(opinions).map(([k, v]) => {
                const IconComponent = TYPE_ICON[k];
                return (
                  <span key={k} className={classes.opinion}>
                    <IconComponent className={classes.optionIcon} />
                    <span>{v}</span>
                  </span>
                );
              })}
            </div>
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
      )}
      <TimeInfo time={createdAt}>{timeAgoStr => t`${timeAgoStr} ago`}</TimeInfo>
    </Infos>
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
