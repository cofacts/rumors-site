import css from 'styled-jsx/css'; // eslint-disable-line import/no-unresolved

export const feedbackStyle = css`
  .ReplyFeedback {
    float: right;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: gray;
  }

  .vote_num {
    font-weight: bold;
    margin-left: 0.5em;
  }

  .btn_vote {
    font-size: 1rem;
    line-height: 100%;
    cursor: pointer;
  }
  .btn_vote:disabled {
    cursor: not-allowed;
  }

  .icon {
    fill: gray;
    padding: 0.3em;
    transition: 0.1s linear;
  }
  .btn_vote:not(:disabled).icon:hover {
    fill: orange;
    transform: scale(1.3);
  }
  .icon_circle {
    width: 1em;
  }
  .icon_corss {
    width: 1em;
  }
  .icon_circle.active {
    fill: #6dc00c;
  }
  .icon_corss.active {
    fill: red;
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
