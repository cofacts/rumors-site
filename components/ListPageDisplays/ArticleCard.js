import gql from 'graphql-tag';
import Link from 'next/link';
import { c, t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { highlight } from 'lib/text';
import Infos, { TimeInfo } from 'components/Infos';
import ExpandableText from 'components/ExpandableText';
import ListPageCard from './ListPageCard';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    // Canceling link styles
    color: 'inherit',
    textDecoration: 'none',

    // Adding visited styles
    '&:visited': {
      backgroundColor: '#fafafa',
      '--background': '#fafafa', // ExpandableText
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
}));

/**
 * Card for an Article.
 *
 * @param {Article} props.article
 * @param {string?} props.query - the currently searched query string to highlight
 */
function ArticleCard({ article, query = '' }) {
  const { id, text, replyCount, replyRequestCount, createdAt } = article;
  const classes = useStyles();

  return (
    <Link href="/article/[id]" as={`/article/${id}`}>
      <a className={cx(classes.root)}>
        <ListPageCard>
          <Infos>
            <TimeInfo time={createdAt}>
              {timeAgo => t`First reported ${timeAgo} ago`}
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
            <ExpandableText className={classes.content} lineClamp={3}>
              {highlight(text, {
                query,
                highlightClassName: classes.highlight,
              })}
            </ExpandableText>
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
      replyCount
      replyRequestCount
      createdAt
    }
  `,
};

export default ArticleCard;
