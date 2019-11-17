import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { t } from 'ttag';
import url from 'url';
import Link from 'next/link';
import PropTypes from 'prop-types';

const UPVOTE = 'UPVOTE';
const DOWNVOTE = 'DOWNVOTE';

// Subset of fields that needs to be updated after login
//
const ReplyRequestInfoForUser = gql`
  fragment ReplyRequestInfoForUser on ReplyRequest {
    id
    ownVote
  }
`;

const ReplyRequestInfo = gql`
  fragment ReplyRequestInfo on ReplyRequest {
    ...ReplyRequestInfoForUser
    reason
    positiveFeedbackCount
    negativeFeedbackCount
  }
  ${ReplyRequestInfoForUser}
`;

const UPDATE_VOTE = gql`
  mutation UpdateVote($replyRequestId: String!, $vote: FeedbackVote!) {
    CreateOrUpdateReplyRequestFeedback(
      replyRequestId: $replyRequestId
      vote: $vote
    ) {
      ...ReplyRequestInfo
    }
  }
  ${ReplyRequestInfo}
`;

const AuthorArticleLink = ({ articleId }) => (
  <Link
    href={url.format({
      pathname: '/articles',
      query: {
        searchUserByArticleId: articleId,
        filter: 'all',
        replyRequestCount: 1,
      },
    })}
  >
    <a className="link-author">
      {t`All messages reported by this user`}
      <style jsx>{`
        .link-author {
          color: #5e7d8f;
          align-self: flex-end;
          white-space: nowrap;
        }
      `}</style>
    </a>
  </Link>
);

function UserIcon() {
  return (
    <>
      <svg
        className="svg-user"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.457 0 200 89.543 200 200 0 36.982-10.049 71.611-27.548 101.328-7.072-25.444-25.663-54.208-63.93-65.374C377.207 271.782 384 248.414 384 224c0-70.689-57.189-128-128-128-70.689 0-128 57.19-128 128 0 24.414 6.793 47.783 19.478 67.954-38.299 11.175-56.876 39.913-63.938 65.362C66.046 327.601 56 292.976 56 256c0-110.457 89.543-200 200-200zm80 168c0 44.183-35.817 80-80 80s-80-35.817-80-80 35.817-80 80-80 80 35.817 80 80zM128 409.669v-27.758c0-20.41 13.53-38.348 33.156-43.955l24.476-6.993C206.342 344.648 230.605 352 256 352s49.658-7.352 70.369-21.038l24.476 6.993C370.47 343.563 384 361.5 384 381.911v27.758C349.315 438.592 304.693 456 256 456s-93.315-17.408-128-46.331z" />
      </svg>
      <style jsx>{`
        .svg-user {
          flex: 0 0 2.5em;
          height: 2.5em;
          fill: gray;
          margin-right: 0.3em;
        }
      `}</style>
    </>
  );
}

function ReplyRequestReason({ isArticleCreator, replyRequest, articleId }) {
  const {
    id: replyRequestId,
    reason: replyRequestReason,
    positiveFeedbackCount,
    negativeFeedbackCount,
    ownVote,
  } = replyRequest;

  const [voteReason, { loading }] = useMutation(UPDATE_VOTE);
  const handleVote = vote => {
    voteReason({ variables: { vote, replyRequestId } });
  };

  if (!(isArticleCreator || replyRequestReason)) return null;

  return (
    <div className="container-request-user">
      {replyRequestReason && (
        <>
          <div className="box-vote">
            <button
              className="btn-vote btn-up-vote"
              onClick={() => handleVote(UPVOTE)}
              disabled={loading || ownVote === UPVOTE}
            >
              <span className="vote-num">{positiveFeedbackCount}</span>
              <svg
                className={`icon ${ownVote === UPVOTE && 'active'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M48.048 352h223.895c42.638 0 64.151-51.731 33.941-81.941l-111.943-112c-18.745-18.745-49.137-18.746-67.882 0l-111.952 112C-16.042 300.208 5.325 352 48.048 352zM160 192l112 112H48l112-112z" />
              </svg>
            </button>
            <button
              className="btn-vote btn-down-vote"
              onClick={() => {
                handleVote(DOWNVOTE);
              }}
              disabled={loading || ownVote === DOWNVOTE}
            >
              <span className="vote-num">{negativeFeedbackCount}</span>
              <svg
                className={`icon ${ownVote === DOWNVOTE && 'active'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M272 160H48.1c-42.6 0-64.2 51.7-33.9 81.9l111.9 112c18.7 18.7 49.1 18.7 67.9 0l112-112c30-30.1 8.7-81.9-34-81.9zM160 320L48 208h224L160 320z" />
              </svg>
            </button>
          </div>
          <UserIcon />
          <p className="reason">{replyRequestReason}</p>
        </>
      )}
      {isArticleCreator && <AuthorArticleLink articleId={articleId} />}

      <style jsx>{`
        .container-request-user {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          border: 2px dashed #ccc;
          border-top: none;
          padding: 0.2em 0.5em;
        }
        .box-vote {
          fill: gray;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          margin-right: 0.2em;
        }
        .reason {
          flex-grow: 1;
          max-width: calc(100% - 5em);
          word-break: break-all; /* someone would paste URL link and make flex content overflow */
        }
        .btn-vote {
          position: relative;
        }
        .btn-vote::after {
          display: block;
          position: absolute;
          padding: 0.3em 0.5em;
          white-space: nowrap;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 0.5em;
          transition: 0.3s ease-out;
          pointer-events: none;
          opacity: 0;
          color: white;
        }
        .btn-vote:hover::after {
          transform: translateX(0);
          opacity: 1;
        }
        .btn-up-vote::after {
          content: ${t`The reason is reasonable`};
          bottom: 100%;
          transform: translateY(100%);
        }
        .btn-down-vote::after {
          content: ${t`The reason is not reasonable`};
          top: 100%;
          transform: translateY(-100%);
        }
        .icon {
          fill: gray;
          transition: 0.1s linear;
          margin-left: 0.3em;
          width: 1em;
          cursor: pointer;
        }
        .btn-vote:not(:disabled) .icon:hover {
          transform: scale(1.3);
        }
        .btn-up-vote:not(:disabled) .icon:hover,
        .btn-up-vote:disabled .icon {
          fill: #6dc00c;
        }
        .btn-down-vote:not(:disabled) .icon:hover,
        .btn-down-vote:disabled .icon {
          fill: red;
        }

        button {
          background: none;
          border: 0;
          border-color: transparent;
          padding: 0;
          display: flex;
          align-items: center;
        }
        button:active,
        button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

ReplyRequestReason.propTypes = {
  articleId: PropTypes.string,
  replyRequest: PropTypes.object.isRequired,
  isArticleCreator: PropTypes.bool.isRequired, // should display link of searchUserByArticleId, no matter have reason or not
};

ReplyRequestReason.fragments = { ReplyRequestInfo, ReplyRequestInfoForUser };

export default ReplyRequestReason;
