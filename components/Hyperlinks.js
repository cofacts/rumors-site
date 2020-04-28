import gql from 'graphql-tag';
import { Box, SvgIcon, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '12px 16px',
    margin: '0 8px 8px 0',
    background: theme.palette.secondary[50],
    borderRadius: 8,
    '& h1': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      margin: 0,
      marginBottom: 10,
      maxWidth: 'inherit',
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
      maxHeight: 40,
      overflow: 'hidden',
      margin: 0,
      display: 'flex',
      marginRight: 10,
    },
    '& .image': {
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

const POLLING_QUERY = {
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

const LinkIcon = props => (
  <SvgIcon {...props} viewBox="0 0 20 10">
    <path d="M1.9 5C1.9 3.29 3.29 1.9 5 1.9H9V0H5C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10H9V8.1H5C3.29 8.1 1.9 6.71 1.9 5ZM6 6H14V4H6V6ZM15 0H11V1.9H15C16.71 1.9 18.1 3.29 18.1 5C18.1 6.71 16.71 8.1 15 8.1H11V10H15C17.76 10 20 7.76 20 5C20 2.24 17.76 0 15 0Z" />
  </SvgIcon>
);

/**
 * @param {string} error - One of ResolveError https://github.com/cofacts/url-resolver/blob/master/src/typeDefs/ResolveError.graphql
 */
function getErrorText(error) {
  switch (error) {
    case 'NAME_NOT_RESOLVED':
      return 'Domain name cannot be resolved';
    case 'UNSUPPORTED':
    case 'INVALID_URL':
      return 'URL is malformed or not supported';
    case 'NOT_REACHABLE':
      return 'Cannot get data from URL';
    case 'HTTPS_ERROR':
      return 'Target site contains HTTPS error';
    default:
      return 'Unknown error';
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
        <LinkIcon />
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
