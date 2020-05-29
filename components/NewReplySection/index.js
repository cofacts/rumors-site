import { useCallback, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { t } from 'ttag';

import { Box } from '@material-ui/core';

import useCurrentUser from 'lib/useCurrentUser';
import Desktop from './Desktop';
import Mobile from './Mobile';
import getDedupedArticleReplies from 'lib/getDedupedArticleReplies';
import RelatedReplies from 'components/RelatedReplies';
import ReplyFormContext, { withReplyFormContext } from './ReplyForm/context';
import { withReplySearchContext } from './ReplySearch/context';

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

const withContext = f => withReplyFormContext(withReplySearchContext(f));

const NewReplySection = withContext(
  ({
    article,
    existingReplyIds,
    relatedArticles,
    onSubmissionComplete,
    onError,
    onClose,
  }) => {
    const { fields, handlers } = useContext(ReplyFormContext);
    const currentUser = useCurrentUser();

    const [createReply, { loading: creatingReply }] = useMutation(
      CREATE_REPLY,
      {
        refetchQueries: ['LoadArticlePage'],
        awaitRefetchQueries: true,
        onCompleted() {
          onSubmissionComplete(); // Notify upper component of submission
          handlers.clear();
          onClose();
        },
        onError,
      }
    );
    const [connectReply, { loading: connectingReply }] = useMutation(
      CONNECT_REPLY,
      {
        refetchQueries: ['LoadArticlePage'],
        awaitRefetchQueries: true,
        onCompleted() {
          onSubmissionComplete(); // Notify upper component of submission
          handlers.clear();
          onClose();
        },
        onError,
      }
    );

    const handleSubmit = useCallback(
      e => {
        const { replyType: type, reference, text } = fields;
        e.preventDefault(); // prevent reload
        if (creatingReply) return;
        createReply({
          variables: { type, reference, text, articleId: article.id },
        });
      },
      [createReply, fields]
    );

    const relatedArticleReplies = getDedupedArticleReplies(
      relatedArticles,
      existingReplyIds
    );

    const handleConnect = replyId => {
      connectReply({ variables: { articleId: article.id, replyId } });
    };

    if (!currentUser) {
      return <p>{t`Please login first.`}</p>;
    }

    const sharedProps = {
      relatedArticleReplies,
      handleSubmit,
      handleConnect,
      connectingReply,
      creatingReply,
      existingReplyIds,
    };

    return (
      <form onSubmit={handleSubmit}>
        {/* prevent chrome auto submit behavior when 'Enter' pressed */}
        <button type="submit" disabled hidden />
        <Box display={{ xs: 'none', md: 'block' }}>
          <Desktop {...sharedProps} />
        </Box>
        <Box display={{ xs: 'block', md: 'none' }}>
          <Mobile onClose={onClose} article={article} {...sharedProps} />
        </Box>
      </form>
    );
  }
);

NewReplySection.fragments = {
  RelatedArticleData,
};

export default NewReplySection;
