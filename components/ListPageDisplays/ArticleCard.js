import gql from 'graphql-tag';
import Link from 'next/link';
import { c, t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import Infos, { TimeInfo } from 'components/Infos';
import ExpandableText from 'components/ExpandableText';
import Thumbnail from 'components/Thumbnail';
import ListPageCard from './ListPageCard';
import { highlightSections, HighlightFields } from 'lib/text';
import { useHighlightStyles } from './utils';
import cx from 'clsx';
import Hyperlinks from 'components/Hyperlinks';

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
  attachment: {
    minWidth: 0, // Don't use intrinsic image width as flex item min-size
    maxHeight: '10em', // Don't let image rows take too much vertical space
    margin: '0 1em 0 0', // Add right margin that separate attachment and text with a space
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
    replyCount,
    replyRequestCount,
    createdAt,
    hyperlinks,
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
            <Thumbnail article={article} className={classes.attachment} />
            <div className={classes.content}>
              {(text || highlight) && (
                <ExpandableText lineClamp={3}>
                  {highlight
                    ? highlightSections(highlight, highlightClasses)
                    : text}
                </ExpandableText>
              )}
              <Hyperlinks hyperlinks={hyperlinks} />
            </div>
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
      hyperlinks {
        ...HyperlinkData
      }
      ...ThumbnailArticleData
    }
    ${Thumbnail.fragments.ThumbnailArticleData}
    ${Hyperlinks.fragments.HyperlinkData}
  `,
  Highlight: HighlightFields,
};

export default ArticleCard;
