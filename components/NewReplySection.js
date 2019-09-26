import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { t } from 'ttag';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar';

import useCurrentUser from 'lib/useCurrentUser';
import ReplyForm from './ReplyForm';

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

function NewReplySection({ articleId, onSubmissionComplete }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [flashMessage, setFlashMessage] = useState(0);
  const currentUser = useCurrentUser();
  const replyFormRef = useRef();
  const [createReply, { loading: creatingReply }] = useMutation(CREATE_REPLY, {
    refetchQueries: ['LoadArticlePage', 'LoadArticlePageForUser'],
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

  if (!currentUser) {
    return <p>{t`Please login first.`}</p>;
  }

  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label={t`New Reply`} />
        <Tab
          label={
            <Badge color="secondary" badgeContent={4}>
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
      <Snackbar
        open={!!flashMessage}
        onClose={() => setFlashMessage('')}
        message={flashMessage}
      />
    </>
  );
}

export default NewReplySection;
