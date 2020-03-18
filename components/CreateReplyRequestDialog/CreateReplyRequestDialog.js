import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;
const formInitialState = {
  visible: false,
  disabled: true,
  text: '',
};

const CREATE_REPLY_REQUEST = gql`
  mutation CreateReplyRequestFromForm($articleId: String!, $reason: String!) {
    CreateReplyRequest(articleId: $articleId, reason: $reason) {
      id
    }
  }
`;
const MIN_REASON_LENGTH = 80;

function SubmitButton({ articleId, text, disabled, onFinish }) {
  const [createReplyRequest] = useMutation(CREATE_REPLY_REQUEST, {
    refetchQueries: ['LoadArticlePage'],
  });

  const handleSubmit = e => {
    e.preventDefault(); // prevent reload
    if (disabled) return;
    createReplyRequest({ variables: { articleId, reason: text } });
    onFinish();
  };

  return (
    <button onClick={handleSubmit} disabled={disabled}>
      {disabled ? '字數太少，無法送出' : '送出理由'}
    </button>
  );
}

class CreateReplyRequestDialog extends React.PureComponent {
  static defaultProps = {};

  constructor() {
    super();
    this.state = {
      ...formInitialState,
    };

    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { text } = this.state;

    // restore from localStorage if applicable.
    // We don't do this in constructor to avoid server/client render mismatch.
    //
    this.setState({
      text: localStorage.text || text,
    });
  }

  set(key, value) {
    this.setState({ [key]: value });

    // Backup to localStorage
    requestAnimationFrame(() => (localStorage[key] = value));
  }

  handleTextChange = ({ target: { value } }) => {
    this.setState({
      text: value,
      disabled: !value || value.length < MIN_REASON_LENGTH,
    });
  };

  onReasonSubmitted = () => {
    this.formRef.current.reset();
    this.setState({
      visible: false,
    });
  };

  showForm = () => {
    this.setState({ visible: true });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  render = () => {
    const { text, visible, disabled } = this.state;

    return (
      <div>
        {visible ? null : <button onClick={this.showForm}>增加回報理由</button>}
        {!visible ? null : (
          <form ref={this.formRef}>
            <p>
              請告訴其他編輯：<strong>您為何覺得這是一則謠言</strong>？
            </p>

            <textarea
              placeholder="例：我用 OO 關鍵字查詢 Facebook，發現⋯⋯ / 我在 XX 官網上找到不一樣的說法如下⋯⋯"
              onChange={this.handleTextChange}
            ></textarea>
            <details>
              <summary>送出理由小撇步</summary>
              <ul>
                <li>闡述更多想法</li>
                <li>去 google 查查看</li>
                <li>把全文複製貼上到 Facebook 搜尋框看看</li>
                <li>把你的結果傳給其他編輯參考吧！</li>
              </ul>
            </details>
            <SubmitButton
              articleId={this.props.articleId}
              text={text}
              disabled={disabled}
              onFinish={this.onReasonSubmitted}
            />
            <button onClick={this.onCancel}>取消</button>

            <style jsx>{`
              textarea {
                width: 100%;
                height: 5em;
              }
            `}</style>
          </form>
        )}
      </div>
    );
  };
}

export default CreateReplyRequestDialog;
