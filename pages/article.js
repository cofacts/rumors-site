import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import Link from 'next/link';
import Head from 'next/head';

import app from '../components/App';
import ArticleInfo from '../components/ArticleInfo';
import ArticleItem from '../components/ArticleItem';
import { load, submitReply, connectReply } from '../redux/articleDetail';

const TYPE_NAME = {
  NOT_ARTICLE: '⚠️️ 非完整文章或訊息',
  NOT_RUMOR: '⭕ 含有正確訊息',
  RUMOR: '❗ 含有不實訊息',
};

const TYPE_DESC = {
  NOT_ARTICLE: '這篇不是轉傳訊息或完整網路文章，如「這個要怎麼用」、或訊息的節錄片段。',
  NOT_RUMOR: '轉傳訊息或網路文章有一部分內容查證屬實。',
  RUMOR: '轉傳訊息或網路文章部分含有有一資訊。',
};

const TYPE_INSTRUCTION = {
  NOT_ARTICLE: '請簡單說明您為何認為這不是完整文章：',
  NOT_RUMOR: '請簡單說明他哪個部分是正確的，作為「資料來源」的導讀：',
  RUMOR: '請簡單說明不實之處，作為「資料來源」的導讀：',
};

function shortenUrl(s, maxLength) {
  try {
    s = decodeURIComponent(s);
  } catch (e) {
    // Probably malformed URI components.
    // Do nothing, just use original s
  }
  return s.length <= maxLength
    ? s
    : `${s.slice(0, maxLength / 2)}⋯${s.slice(-maxLength / 2)}`;
}

const urlRegExp = /(https?:\/\/\S+)/;
function linkify(str, maxLength = 80) {
  if (!str) return '';
  return str
    .split(urlRegExp)
    .map(
      (s, i) =>
        s.match(urlRegExp)
          ? <a key={`link${i}`} href={s}>{shortenUrl(s, maxLength)}</a>
          : s
    );
}

function nl2br(text = '') {
  const sentences = text.split('\n');
  if (sentences.length <= 1) return sentences.map(s => linkify(s));
  return sentences.map((sentence, i) =>
    <div style={{ minHeight: '1.6em' }} key={i}>{linkify(sentence)}</div>
  );
}

export default compose(
  app((dispatch, { query: { id } }) => dispatch(load(id))),
  connect(
    ({ articleDetail }) => ({
      isLoading: articleDetail.getIn(['state', 'isLoading']),
      isReplyLoading: articleDetail.getIn(['state', 'isReplyLoading']),
      data: articleDetail.get('data'),
    }),
    {
      submitReply,
      connectReply,
    }
  )
)(
  class ArticlePage extends React.Component {
    handleConnect = ({ target: { value: replyId } }) =>
      this.props.connectReply(this.props.query.id, replyId);

    handleSubmit = reply =>
      this.props.submitReply({ ...reply, articleId: this.props.query.id });

    render() {
      const { data, isLoading, isReplyLoading } = this.props;

      const article = data.get('article');
      const replyConnections = data.get('replyConnections');
      const relatedArticles = data.get('relatedArticles');
      const relatedReplies = data.get('relatedReplies');

      if (isLoading && article === null) {
        return <div>Loading...</div>;
      }

      if (article === null) {
        return <div>Article not found.</div>;
      }

      return (
        <div className="root">
          <Head>
            <title>{article.get('text').slice(0, 15)}⋯⋯ - 文章</title>
          </Head>

          <section className="section">
            <header className="header">
              <h2>訊息原文</h2>
              <ArticleInfo article={article} />
            </header>
            <div className="message">{nl2br(article.get('text'))}</div>
          </section>

          <section className="section">
            <h2>回應</h2>
            {replyConnections.size
              ? <ul className="items">
                  {replyConnections.map(conn =>
                    <ReplyItem
                      key={conn.get('id')}
                      id={conn.get('id')}
                      reply={conn.get('reply')}
                      connectionAuthor={conn.get('user')}
                      feedbackCount={conn.get('feedbackCount')}
                    />
                  )}
                </ul>
              : <p>目前尚無回應</p>}

            <ReplyForm onSubmit={this.handleSubmit} disabled={isReplyLoading} />
          </section>

          <section className="section">
            <h2>相關文章的回應</h2>
            {relatedReplies.size
              ? <ul className="items">
                  {relatedReplies.map(reply =>
                    <RelatedReplyItem
                      key={reply.get('id')}
                      reply={reply}
                      articleId={reply.get('articleId')}
                      onConnect={this.handleConnect}
                    />
                  )}
                </ul>
              : <p>目前沒有相關的回應</p>}

          </section>

          {relatedArticles.size
            ? <section className="section">
                <h2>你可能也會對這些類似文章有興趣</h2>
                <ul className="items">
                  {relatedArticles.map(article =>
                    <RelatedArticleItem
                      key={article.get('id')}
                      article={article}
                    />
                  )}
                </ul>
              </section>
            : ''}
          <style jsx>{`
            .root {
              padding: 24px;
              @media screen and (min-width: 768px) {
                padding: 40px;
              }
            }
            .section {
              margin-bottom: 84px;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .message {
              border: 1px solid #ccc;
              background: #eee;
              border-radius: 3px;
              padding: 24px;
            }
            .items {
              list-style-type: none;
              padding-left: 0;
            }
          `}</style>
        </div>
      );
    }
  }
);

function ReplyItem({ reply, connectionAuthor, feedbackCount }) {
  const replyVersion = reply.getIn(['versions', 0]);
  const createdAt = moment(replyVersion.get('createdAt'));
  return (
    <li className="root">
      <header className="section">
        {connectionAuthor ? connectionAuthor.get('name') : '有人'}
        標記此篇為：<strong title={TYPE_DESC[replyVersion.get('type')]}>
          {TYPE_NAME[replyVersion.get('type')]}
        </strong>
      </header>
      <section className="section">
        <h3>理由</h3>
        <ExpandableText>{replyVersion.get('text')}</ExpandableText>
      </section>
      <section className="section">
        <h3>出處</h3>
        {replyVersion.get('reference')
          ? nl2br(replyVersion.get('reference'))
          : '⚠️️ 此回應沒有出處，請自行斟酌回應真實性。'}
      </section>
      <footer>
        <span title={createdAt.format('lll')}>{createdAt.fromNow()}</span>
        <span title="Coming soon!">・{feedbackCount} 人評價了這則回應</span>
      </footer>

      <style jsx>{`
        .root {
          padding: 24px;
          border: 1px solid #ccc;
          border-top: 0;
          &:first-child {
            border-top: 1px solid #ccc;
          }
          &:hover {
            background: rgba(0, 0, 0, .05);
          }
        }
        h3 {
          margin: 0;
        }
        .section {
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px dotted rgba(0, 0, 0, .2);
        }
      `}</style>
    </li>
  );
}

function RelatedReplyItem({ reply, articleId, onConnect }) {
  const replyVersion = reply.getIn(['versions', 0]);
  const createdAt = moment(replyVersion.get('createdAt'));
  return (
    <li className="root">
      <header className="section">
        <Link href={`/article/?id=${articleId}`} as={`/article/${articleId}`}>
          <a>
            其他文章
          </a>
        </Link>
        被標記為
        ：<strong title={TYPE_DESC[replyVersion.get('type')]}>
          {TYPE_NAME[replyVersion.get('type')]}
        </strong>
      </header>
      <section className="section">
        <ExpandableText>{replyVersion.get('text')}</ExpandableText>
      </section>
      <footer>
        <span title={createdAt.format('lll')}>{createdAt.fromNow()}</span>
        ・<button type="button" value={reply.get('id')} onClick={onConnect}>
          將這份回應加進此文章的回應
        </button>
      </footer>

      <style jsx>{`
        .root {
          padding: 24px;
          border: 1px solid #ccc;
          border-top: 0;
          &:first-child {
            border-top: 1px solid #ccc;
          }
          &:hover {
            background: rgba(0, 0, 0, .05);
          }
        }
        h3 {
          margin: 0;
        }
        .section {
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px dotted rgba(0, 0, 0, .2);
        }
      `}</style>
    </li>
  );
}

function RelatedArticleItem({ article }) {
  return (
    <li>
      <ArticleItem article={article} />
    </li>
  );
}

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;
const formInitialState = {
  replyType: 'NOT_ARTICLE',
  reference: '',
  text: '',
};

class ReplyForm extends React.PureComponent {
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
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => (localStorage[key] = value));
    }
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

        <button type="submit" disabled={disabled}>送出回應</button>

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
        `}</style>
      </form>
    );
  }
}

class ExpandableText extends React.Component {
  static defaultProps = {
    children: '',
    lines: 3,
  };

  constructor({ children }) {
    super();

    if (typeof children !== 'string') {
      throw new Error('<ExpandableText> only accepts string children.');
    }

    this.state = {
      isExpanded: false,
    };
  }

  toggleExapnd = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { children, lines } = this.props;
    const { isExpanded } = this.state;
    const sentences = nl2br(children);

    if (sentences.length <= lines) {
      return (
        <div>
          {sentences}
        </div>
      );
    }

    return (
      <div>
        {isExpanded ? sentences : sentences.slice(0, lines)}

        <button className="more" onClick={this.toggleExapnd}>
          {isExpanded ? '隱藏全文' : '閱讀更多'}
        </button>
        <style jsx>{`
          .more {
            border: 0;
            background: transparent;
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }
}
