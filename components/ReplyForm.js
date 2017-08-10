import React from 'react';
import { TYPE_NAME, TYPE_DESC, TYPE_INSTRUCTION } from '../constants/replyType';

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;
const formInitialState = {
  replyType: 'NOT_ARTICLE',
  reference: '',
  text: '',
};

export default class ReplyForm extends React.PureComponent {
  static defaultProps = {
    onSubmit() {
      return Promise.reject();
    },
    disabled: false,
  };

  constructor() {
    super();
    this.state = {
      ...formInitialState,
    };
  }

  componentDidMount() {
    const { replyType, reference, text } = this.state;

    // restore from localStorage if applicable.
    // We don't do this in constructor to avoid server/client render mismatch.
    //
    this.setState({
      replyType: localStorage.replyType || replyType,
      reference: localStorage.reference || reference,
      text: localStorage.text || text,
    });
  }

  set(key, value) {
    this.setState({ [key]: value });

    // Backup to localStorage
    requestAnimationFrame(() => (localStorage[key] = value));
  }

  handleTypeChange = ({ target: { value } }) => {
    this.set('replyType', value);
  };

  handleTextChange = ({ target: { value } }) => {
    this.set('text', value);
  };

  handleReferenceChange = ({ target: { value } }) => {
    this.set('reference', value);
  };

  handleSubmit = e => {
    e.preventDefault(); // prevent reload
    if (this.props.disabled) return;
    const { replyType, reference, text } = this.state;
    this.props.onSubmit({ type: replyType, reference, text }).then(() => {
      // Clean up localStorage on success
      delete localStorage.replyType;
      delete localStorage.reference;
      delete localStorage.text;

      this.setState(formInitialState);
    });
  };

  handleSuggestionAdd = e => {
    const suggestion = e.target.textContent;
    this.set('text', `${this.state.text} ${suggestion}`);
  };

  render() {
    const { replyType, text, reference } = this.state;
    const { disabled } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <select
            name="type"
            value={replyType}
            onChange={this.handleTypeChange}
          >
            <option value="NOT_ARTICLE">{TYPE_NAME['NOT_ARTICLE']}</option>
            <option value="NOT_RUMOR">{TYPE_NAME['NOT_RUMOR']}</option>
            <option value="RUMOR">{TYPE_NAME['RUMOR']}</option>
          </select>
          <span>：{TYPE_DESC[replyType]}</span>
        </p>

        <div>
          <label htmlFor="text">
            {TYPE_INSTRUCTION[replyType]}
          </label>
          <br />
          {replyType === 'NOT_ARTICLE'
            ? <p>
                常見原因 ——&nbsp;
                <button
                  className="suggestion"
                  type="button"
                  onClick={this.handleSuggestionAdd}
                >
                  長度太短，不像轉傳文章。
                </button>
                <button
                  className="suggestion"
                  type="button"
                  onClick={this.handleSuggestionAdd}
                >
                  疑似為訊息之節錄片段，並非全文。
                </button>
                <button
                  className="suggestion"
                  type="button"
                  onClick={this.handleSuggestionAdd}
                >
                  詢問句，非轉傳訊息。
                </button>
                <button
                  className="suggestion"
                  type="button"
                  onClick={this.handleSuggestionAdd}
                >
                  測試用之無意義訊息。
                </button>
              </p>
            : ''}
          <textarea
            required
            id="text"
            placeholder="140 字以內"
            onChange={this.handleTextChange}
            value={text}
          />
        </div>

        {replyType === 'NOT_ARTICLE'
          ? ''
          : <p>
              <label htmlFor="reference">
                資料來源：
              </label>
              <br />
              <textarea
                required
                id="reference"
                placeholder="超連結與連結說明文字"
                onChange={this.handleReferenceChange}
                value={reference}
              />
            </p>}

        <button className="submit" type="submit" disabled={disabled}>
          送出回應
        </button>
        <span className="help">
          不知道如何下手嗎？
          <a
            href="https://www.facebook.com/groups/cofacts/permalink/1959641497601003/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook 編輯求助區
          </a>
          歡迎您 :)
        </span>

        <style jsx>{`
          textarea {
            width: 100%;
            height: 5em;
          }
          .suggestion {
            background: transparent;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px;
            margin: 0 8px 8px 0;
            font-size: 12px;
          }
          .submit {
            margin-right: 16px;
          }
          .help {
            font-size: 12px;
            font-style: italic;
            display: inline-block;
            color: #999;
          }
        `}</style>
      </form>
    );
  }
}
