import gql from 'graphql-tag';
import Link from 'next/link';
import { c, t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import Infos, { TimeInfo } from 'components/Infos';
import ExpandableText from 'components/ExpandableText';
import ListPageCard from './ListPageCard';
import { highlightSections } from 'lib/text';
import { useHighlightStyles } from './utils';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    // Canceling link styles
    color: 'inherit',
    textDecoration: 'none',

    // Adding visited styles
    '&:visited > *': {
      backgroundColor: '#fafafa',
      '--background': '#fafafa', // ExpandableText
    },

    // Adding visited styles
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary[500],
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 10,
    [theme.breakpoints.up('md')]: {
      marginTop: 14,
    },
  },
  infoBox: {
    backgroundColor: theme.palette.secondary[50],
    borderRadius: 8,
    display: 'flex',
    padding: '6px 0',
    marginRight: 12,

    [theme.breakpoints.up('md')]: {
      marginRight: 24,
    },

    '& > div': {
      textAlign: 'center',
      width: 50,
      [theme.breakpoints.up('md')]: {
        width: 65,
        padding: '4px 0',
      },
      '&:first-child': {
        borderRight: `1px solid ${theme.palette.secondary[500]}`,
      },
    },

    '& h2': {
      margin: 0,
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 1,
      [theme.breakpoints.up('md')]: {
        fontSize: 24,
      },
    },

    '& span': { fontSize: 12 },
  },
  content: {
    // fix very very long string layout
    lineBreak: 'anywhere',
    minWidth: 0,
    flex: 1,
    fontSize: 12,
    color: theme.palette.secondary[500],
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
  },
  highlight: {
    color: theme.palette.primary[500],
  },
  attachmentImage: {
    maxWidth: 336,
    maxHeight: 500,
  },
}));

/**
 * Card for an Article.
 *
 * @param {Article} props.article
 * @param {Highlights?} props.highlight - If given, display search snippet instead of reply text
 */
function ArticleCard({ article, highlight = '' }) {
  const {
    id,
    text,
    attachmentUrl,
    replyCount,
    replyRequestCount,
    createdAt,
  } = article;
  const classes = useStyles();
  const highlightClasses = useHighlightStyles();

  return (
    <Link href="/article/[id]" as={`/article/${id}`}>
      <a className={cx(classes.root)}>
        <ListPageCard>
          <Infos>
            <TimeInfo time={createdAt}>
              {timeAgo => t`First reported ${timeAgo}`}
            </TimeInfo>
          </Infos>
          <div className={classes.flex}>
            <div className={classes.infoBox}>
              <div>
                <h2>{+replyCount}</h2>
                <span>{c('Info box').t`replies`}</span>
              </div>
              <div>
                <h2>{+replyRequestCount}</h2>
                <span>{c('Info box').t`reports`}</span>
              </div>
            </div>
            {text ? (
              <ExpandableText className={classes.content} lineClamp={3}>
                {highlight
                  ? highlightSections(highlight, highlightClasses)
                  : text}
              </ExpandableText>
            ) : (
              <img
                className={classes.attachmentImage}
                src={attachmentUrl}
                alt="image"
              ></img>
            )}
          </div>
        </ListPageCard>
      </a>
    </Link>
  );
}

ArticleCard.fragments = {
  ArticleCard: gql`
    fragment ArticleCard on Article {
      id
      text
      attachmentUrl
      replyCount
      replyRequestCount
      createdAt
    }
  `,
  Highlight: highlightSections.fragments.HighlightFields,
};

export default ArticleCard;
