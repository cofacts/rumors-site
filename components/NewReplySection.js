import { useState, useCallback, useRef, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { t } from 'ttag';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar';

import useCurrentUser from 'lib/useCurrentUser';
import ReplyForm from './ReplyForm';
import RelatedReplies from './RelatedReplies';

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
    onCompleted(data) {
      onSubmissionComplete(data.CreateReply.id); // Notify upper component of submission
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

  const handleTabChange = useCallback((e, v) => setSelectedTab(v), []);
  const handleSubmit = useCallback(
    replyData => {
      createReply({ variables: { ...replyData, articleId } });
    },
    [createReply]
  );

  // Convert relatedArticles field into list of article replies with replyIds not in
  // existingReplyIds, and their replyIds are unique among each item.
  //
  // Sorted by article relevance.
  //
  const relatedArticleReplies = useMemo(() => {
    const existingReplyIdMap = (existingReplyIds || []).reduce(
      (map, replyId) => {
        map[replyId] = true;
        return map;
      },
      {}
    );

    const articleReplies = [];
    (relatedArticles.edges || []).forEach(({ node }) => {
      node.articleReplies.forEach(articleReply => {
        if (existingReplyIdMap[articleReply.replyId]) return;

        articleReplies.push(articleReply);
        existingReplyIdMap[articleReply.replyId] = true;
      });
    });

    return articleReplies;
  }, [relatedArticles, existingReplyIds]);

  // TODO
  const handleConnect = () => {};

  if (!currentUser) {
    return <p>{t`Please login first.`}</p>;
  }

  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label={t`New Reply`} />
        <Tab
          label={
            <Badge
              color="secondary"
              badgeContent={relatedArticleReplies.length}
            >
              {t`Reuse existing reply`}
            </Badge>
          }
        />
        <Tab label={t`Search`} />
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
        <RelatedReplies
          onConnect={handleConnect}
          relatedArticleReplies={relatedArticleReplies}
          existingReplyIds={existingReplyIds}
        />
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
