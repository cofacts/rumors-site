import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { t } from 'ttag';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar';

import useCurrentUser from 'lib/useCurrentUser';
import ReplyForm from './ReplyForm';
import RelatedReplies from './RelatedReplies';
import getDedupedArticleReplies from 'lib/getDedupedArticleReplies';
import ReplySearch from './ReplySearch';

const RelatedArticleData = gql`
  fragment RelatedArticleData on Article {
    relatedArticles(filter: { replyCount: { GT: 0 } }) {
      edges {
        node {
          id
          articleReplies {
            ...RelatedArticleReplyData
          }
        }
      }
    }
  }
  ${RelatedReplies.fragments.RelatedArticleReplyData}
`;

const CREATE_REPLY = gql`
  mutation CreateReplyInArticlePage(
    $articleId: String!
    $text: String!
    $type: ReplyTypeEnum!
    $reference: String
  ) {
    CreateReply(
      articleId: $articleId
      text: $text
      type: $type
      reference: $reference
    ) {
      id
    }
  }
`;

const CONNECT_REPLY = gql`
  mutation ConnectReplyInArticlePage($articleId: String!, $replyId: String!) {
    CreateArticleReply(articleId: $articleId, replyId: $replyId) {
      articleId
    }
  }
`;

const CustomTab = withStyles(theme => ({
  root: {
    position: 'relative',
    color: theme.palette.secondary[300],
    '&$selected': {
      color: theme.palette.primary,
      '& $indicator': {
        color: theme.palette.primary,
      },
    },
  },
}))(Tab);

const CustomBadge = withStyles(theme => ({
  badge: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary[300],
    transform: 'scale(1) translate(120%, 0)',
  },
}))(Badge);

function NewReplySection({
  articleId,
  existingReplyIds,
  relatedArticles,
  onSubmissionComplete,
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [flashMessage, setFlashMessage] = useState(0);
  const currentUser = useCurrentUser();
  const replyFormRef = useRef();
  const [createReply, { loading: creatingReply }] = useMutation(CREATE_REPLY, {
    refetchQueries: ['LoadArticlePage'],
    awaitRefetchQueries: true,
    onCompleted() {
      onSubmissionComplete(); // Notify upper component of submission
      if (replyFormRef.current) {
        replyFormRef.current.clear();
      }
      setFlashMessage(t`Your reply has been submitted.`);
    },
    onError(error) {
      console.error(error);
      setFlashMessage(error.toString());
    },
  });
  const [connectReply, { loading: connectingReply }] = useMutation(
    CONNECT_REPLY,
    {
      refetchQueries: ['LoadArticlePage'],
      awaitRefetchQueries: true,
      onCompleted() {
        onSubmissionComplete(); // Notify upper component of submission
        setFlashMessage(t`Your have attached the reply to this message.`);
      },
      onError(error) {
        console.error(error);
        setFlashMessage(error.toString());
      },
    }
  );

  const handleTabChange = useCallback((e, v) => setSelectedTab(v), []);
  const handleSubmit = useCallback(
    replyData => {
      createReply({ variables: { ...replyData, articleId } });
    },
    [createReply]
  );

  const relatedArticleReplies = getDedupedArticleReplies(
    relatedArticles,
    existingReplyIds
  );

  const handleConnect = replyId => {
    connectReply({ variables: { articleId, replyId } });
  };

  if (!currentUser) {
    return <p>{t`Please login first.`}</p>;
  }

  return (
    <>
      <Tabs
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        value={selectedTab}
        onChange={handleTabChange}
      >
        <CustomTab label={t`New Reply`} />
        <CustomTab
          label={
            <CustomBadge badgeContent={relatedArticleReplies.length || 1000}>
              {t`Reuse existing reply`}
            </CustomBadge>
          }
        />
      </Tabs>
      
      {selectedTab === 0 && (
        <ReplyForm
          ref={replyFormRef}
          onSubmit={handleSubmit}
          disabled={creatingReply}
        />
      )}
      {selectedTab === 1 && (
        <>
          <ReplySearch
            existingReplyIds={existingReplyIds}
            onConnect={handleConnect}
            disabled={connectingReply}
          />
          <RelatedReplies
            relatedArticleReplies={relatedArticleReplies}
            onConnect={handleConnect}
            disabled={connectingReply}
          />
        </>
      )}
      <Snackbar
        open={!!flashMessage}
        onClose={() => setFlashMessage('')}
        message={flashMessage}
      />
    </>
  );
}

NewReplySection.fragments = {
  RelatedArticleData,
};

export default NewReplySection;
