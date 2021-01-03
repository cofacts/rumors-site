import gql from 'graphql-tag';
import { t } from 'ttag';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

import { HyperlinkIcon } from 'components/icons';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '12px 16px',
    margin: '0 8px 8px 0',
    background: theme.palette.secondary[50],
    borderRadius: 8,
    maxWidth: '100%',
    '& h1': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      margin: 0,
      marginBottom: 10,
      maxWidth: 'inherit',
      fontSize: 14,
    },
  },
  url: {
    color: theme.palette.secondary[300],
    display: 'flex',
    alignItems: 'center',
    marginTop: 16,
    '& a': {
      color: theme.palette.secondary[300],
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textDecoration: 'none',
      marginLeft: 8,
    },
  },
  preview: {
    display: 'flex',
    borderLeft: `4px solid ${theme.palette.secondary[200]}`,
    paddingLeft: 10,
    paddingRight: 15,
    minHeight: 40,
    justifyContent: 'space-between',
    '& .summary': {
      color: theme.palette.secondary[500],
      overflow: 'hidden',
      margin: 0,
      display: '-webkit-box',
      boxOrient: 'vertical',
      textOverflow: 'ellipsis',
      lineClamp: 2,
    },
    '& .image': {
      marginLeft: 10,
      margin: 0,
      maxHeight: 60,
      minWidth: 60,
      background: `#ccc center center no-repeat`,
      backgroundSize: 'cover',
      backgroundImage: ({ topImageUrl }) => `url(${topImageUrl})`,
      borderRadius: 3,
    },
  },
  error: {
    color: 'firebrick',
    fontStyle: 'italic',
  },
}));

const HyperlinkData = gql`
  fragment HyperlinkData on Hyperlink {
    title
    url
    summary
    topImageUrl
    error
  }
`;

export const POLLING_QUERY = {
  articles: gql`
    query PollingArticleHyperlink($id: String!) {
      GetArticle(id: $id) {
        id
        hyperlinks {
          ...HyperlinkData
        }
      }
    }
    ${HyperlinkData}
  `,
  replies: gql`
    query PollingReplyHyperlink($id: String!) {
      GetReply(id: $id) {
        id
        hyperlinks {
          ...HyperlinkData
        }
      }
    }
    ${HyperlinkData}
  `,
};

/**
 * @param {string} error - One of ResolveError https://github.com/cofacts/url-resolver/blob/master/src/typeDefs/ResolveError.graphql
 */
function getErrorText(error) {
  switch (error) {
    case 'NAME_NOT_RESOLVED':
      return t`Domain name cannot be resolved`;
    case 'UNSUPPORTED':
    case 'INVALID_URL':
      return t`URL is malformed or not supported`;
    case 'NOT_REACHABLE':
      return t`Cannot get data from URL`;
    case 'HTTPS_ERROR':
      return t`Target site contains HTTPS error`;
    default:
      return t`Unknown error`;
  }
}

/**
 * @param {object} props.hyperlink
 */
function Hyperlink({ hyperlink }) {
  const { title, topImageUrl, error, url } = hyperlink;
  const summary = (hyperlink.summary || '').slice(0, 200);

  const classes = useStyles({ topImageUrl });

  return (
    <article className={classes.root}>
      <h1 title={title}>{title}</h1>
      <div className={classes.preview}>
        <p className="summary" title={summary}>
          {summary}
        </p>
        {topImageUrl && <figure className="image" />}
        {error && <p className="error">{getErrorText(error)}</p>}
      </div>
      <span className={classes.url}>
        <HyperlinkIcon />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </span>
    </article>
  );
}

function PollingHyperlink({ pollingType, pollingId }) {
  // The loaded data will populate apollo-client's normalized Article/Reply cache via apollo-client
  // automatic cache updates.
  // Ref: https://www.apollographql.com/docs/react/caching/cache-configuration/#automatic-cache-updates
  //
  // Therefore, we don't need to read query results here.
  //
  useQuery(POLLING_QUERY[pollingType], {
    variables: { id: pollingId },
    pollInterval: 2000,
  });

  return <CircularProgress />;
}

/**
 * @param {object[] | null} props.hyperlinks
 * @param {'articles'|'replies'?} props.pollingType - poll article or reply for hyperlinks when it's not loaded (null)
 * @param {string?} props.pollingId - polling article or reply id for hyperlinks when it's not loaded (null)
 */
function Hyperlinks({ hyperlinks, pollingType, pollingId }) {
  if (!((pollingId && pollingType) || (!pollingId && !pollingType))) {
    throw new Error('pollingType and pollingId must be specified together');
  }

  if (hyperlinks && hyperlinks.length === 0) return null;

  return (
    <Box
      component="section"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      mt={2}
      mb={1}
    >
      {(hyperlinks || []).map((hyperlink, idx) => (
        <Hyperlink key={idx} hyperlink={hyperlink} />
      ))}
      {!hyperlinks && pollingId && (
        <PollingHyperlink pollingId={pollingId} pollingType={pollingType} />
      )}
    </Box>
  );
}

Hyperlinks.fragments = {
  HyperlinkData,
};

export default Hyperlinks;
