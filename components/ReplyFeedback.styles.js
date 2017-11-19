import css from 'styled-jsx/css'; // eslint-disable-line import/no-unresolved

export const feedbackStyle = css`
  .ReplyFeedback {
    float: right;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .vote_num {
    font-weight: bold;
    margin-left: 0.5em;
  }

  .btn_vote {
    font-size: 1rem;
    cursor: pointer;
  }
  .btn_vote:disabled {
    cursor: not-allowed;
  }

  .icon_thunbs {
    fill: gray;
    padding: 0.3em;
    transition: 0.1s linear;
  }
  .btn_vote:not(:disabled).icon_thunbs:hover {
    fill: orange;
    transform: scale(1.3);
  }
  .icon_thunbs.active {
    fill: orange;
  }
  .icon_thumbs-up {
    width: 1em;
  }
  .icon_thumbs-down {
    width: 1em;
  }

  button {
    background: none;
    border: 0;
    border-color: transparent;
    padding: 0;
  }
  button:active,
  button:focus {
    outline: none;
  }
`;
