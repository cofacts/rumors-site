import gql from 'graphql-tag';
import { useEffect } from 'react';
import { t, jt, ngettext, msgid } from 'ttag';
import { useRouter } from 'next/router';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import Head from 'next/head';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import withData from 'lib/apollo';
import useCurrentUser from 'lib/useCurrentUser';
import { usePushToDataLayer } from 'lib/gtm';
import getTermsString from 'lib/terms';

import ExpandableText from 'components/ExpandableText';
import AppLayout from 'components/AppLayout';
import ArticleReply from 'components/ArticleReply';
import { Card, CardHeader, CardContent } from 'components/Card';
import { ProfileTooltip } from 'components/ProfileLink';
import Infos, { TimeInfo } from 'components/Infos';
import {
  SideSection,
  SideSectionHeader,
  SideSectionLinks,
  SideSectionLink,
  SideSectionText,
} from 'components/SideSection';

import { nl2br, ellipsis } from 'lib/text';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: '24px 0',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  main: {
    flex: 1,
    minWidth: 0,
    '& > *': {
      marginBottom: 12,
    },
    [theme.breakpoints.up('md')]: {
      flex: 3,
      marginRight: 12,
    },
  },
  articleLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  infos: {
    marginTop: 12,
  },
}));

const LOAD_REPLY = gql`
  query LoadReplyPage($id: String!) {
    GetReply(id: $id) {
      id
      text
      createdAt
      articleReplies {
        article {
          id
          text
          replyCount
        }
        createdAt
        status
        user {
          ...ProfileLinkUserData
        }
        ...ArticleReplyData
      }
      similarReplies(orderBy: [{ _score: DESC }]) {
        edges {
          node {
            id
            text
            articleReplies(status: NORMAL) {
              articleId
            }
          }
        }
      }
    }
  }
  ${ArticleReply.fragments.ArticleReplyData}
  ${ProfileTooltip.fragments.ProfileTooltipUserData}
`;

const LOAD_REPLY_FOR_USER = gql`
  query LoadReplyPageForUser($id: String!) {
    GetReply(id: $id) {
      id
      articleReplies {
        ...ArticleReplyForUser
      }
    }
  }
  ${ArticleReply.fragments.ArticleReplyForUser}
`;

const UPDATE_ARTICLE_REPLY_STATUS = gql`
  mutation UpdateArticleReplyStatus(
    $articleId: String!
    $replyId: String!
    $status: ArticleReplyStatusEnum!
  ) {
    UpdateArticleReplyStatus(
      articleId: $articleId
      replyId: $replyId
      status: $status
    ) {
      articleId
      replyId
      status
    }
  }
`;

/**
 * String wrapper for better i18n.
 *
 * @param {number} count
 * @return {JSX | null} Text that indicates reply count, or null when no other replies.
 */
function getReplyCountElem(count) {
  const otherCount = count - 1;
  if (otherCount <= 0) return null;
  return (
    <span>
      {ngettext(
        msgid`${otherCount} other reply`,
        `${otherCount} other replies`,
        otherCount
      )}
    </span>
  );
}

function ReplyPage() {
  const { query } = useRouter();
  const replyVars = { id: query.id };

  const { data, loading } = useQuery(LOAD_REPLY, { variables: replyVars });
  const [
    loadReplyForUser,
    { refetch: refetchReplyForUser, called: replyForUserCalled },
  ] = useLazyQuery(LOAD_REPLY_FOR_USER, {
    variables: replyVars,
    fetchPolicy: 'network-only',
  });

  const [
    updateArticleReplyStatus,
    { loading: updatingArticleReplyStatus },
  ] = useMutation(UPDATE_ARTICLE_REPLY_STATUS);

  const handleDelete = ({ articleId, replyId }) => {
    updateArticleReplyStatus({
      variables: { articleId, replyId, status: 'DELETED' },
    });
  };

  const handleRestore = ({ articleId, replyId }) => {
    updateArticleReplyStatus({
      variables: { articleId, replyId, status: 'NORMAL' },
      refetchQueries: ['LoadArticlePage'],
    });
  };

  const currentUser = useCurrentUser();
  const classes = useStyles();

  // Load user field when currentUser changes
  useEffect(() => {
    if (!replyForUserCalled) {
      loadReplyForUser();
    } else {
      refetchReplyForUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const reply = data?.GetReply;
  usePushToDataLayer(!!reply, { event: 'dataLoaded' });

  if (loading) {
    return (
      <AppLayout>
        <Head>
          <title>{t`Loading`}</title>
        </Head>
        <div className={classes.root}>
          <Card>
            <CardContent>{t`Loading`}...</CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!reply) {
    return (
      <AppLayout>
        <Head>
          <title>{t`Not found`}</title>
        </Head>
        <div className={classes.root}>
          <Card>
            <CardContent>{t`Reply does not exist`}</CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const originalArticleReply = reply.articleReplies.reduce(
    (earliest, articleReply) =>
      articleReply.createdAt < earliest.createdAt ? articleReply : earliest,
    reply.articleReplies[0]
  );
  const isDeleted = originalArticleReply.status === 'DELETED';

  const otherArticleReplies = reply.articleReplies
    .filter(
      ({ article, status }) =>
        article.id !== originalArticleReply.article.id && status === 'NORMAL'
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const similarReplies = reply?.similarReplies?.edges || [];

  return (
    <AppLayout>
      <Head>
        <title>
          {ellipsis(reply.text, { wordCount: 100 })} | {t`Cofacts`}
        </title>
      </Head>
      <div className={classes.root}>
        <div className={classes.main}>
          <Card>
            <CardHeader>{t`This reply`}</CardHeader>
            <CardContent>
              <ArticleReply
                articleReply={originalArticleReply}
                actionText={isDeleted ? t`Restore` : t`Delete`}
                onAction={isDeleted ? handleRestore : handleDelete}
                disabled={updatingArticleReplyStatus}
                linkToReply={false}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>{t`The reply is used in the following messages`}</CardHeader>
            <CardContent>
              <Link
                href="/article/[id]"
                as={`/article/${originalArticleReply.article.id}`}
              >
                <a className={classes.articleLink}>
                  <ExpandableText lineClamp={5}>
                    {nl2br(originalArticleReply.article.text)}
                  </ExpandableText>
                  <Infos className={classes.infos}>
                    {isDeleted && <span>{t`Deleted by its author`}</span>}
                    {getReplyCountElem(originalArticleReply.article.replyCount)}
                    <TimeInfo time={originalArticleReply.createdAt}></TimeInfo>
                  </Infos>
                </a>
              </Link>
            </CardContent>
            {otherArticleReplies.map(ar => {
              const editorElem = (
                <ProfileTooltip key="editor" user={ar.user}>
                  <span>{ar?.user?.name || t`someone`}</span>
                </ProfileTooltip>
              );

              return (
                <CardContent key={ar.article.id}>
                  <Link href="/article/[id]" as={`/article/${ar.article.id}`}>
                    <a className={classes.articleLink}>
                      <ExpandableText>{nl2br(ar.article.text)}</ExpandableText>
                      <Infos className={classes.infos}>
                        <>{jt`Added by ${editorElem}`}</>
                        {getReplyCountElem(ar.article.replyCount)}
                        <TimeInfo time={ar.createdAt}></TimeInfo>
                      </Infos>
                    </a>
                  </Link>
                </CardContent>
              );
            })}
          </Card>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ margin: '16px 0' }}
          >
            {getTermsString(t`The content above`, true)}
          </Typography>
        </div>
        <SideSection>
          <SideSectionHeader>{t`Similar replies`}</SideSectionHeader>
          {similarReplies.length > 0 ? (
            <SideSectionLinks>
              {similarReplies.map(({ node }) => (
                <Link
                  key={node.id}
                  href="/reply/[id]"
                  as={`/reply/${node.id}`}
                  passHref
                >
                  <SideSectionLink>
                    <SideSectionText>{node.text}</SideSectionText>
                    <Infos className={classes.infos}>
                      {ngettext(
                        msgid`Used in ${node.articleReplies.length} message`,
                        `Used in ${node.articleReplies.length} messages`,
                        node.articleReplies.length
                      )}
                    </Infos>
                  </SideSectionLink>
                </Link>
              ))}
            </SideSectionLinks>
          ) : (
            <Box textAlign="center" pt={4} pb={3}>
              {t`No similar replies found`}
            </Box>
          )}
        </SideSection>
      </div>
    </AppLayout>
  );
}

export default withData(ReplyPage);
