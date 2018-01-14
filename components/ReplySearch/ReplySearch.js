import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import stringSimilarity from 'string-similarity';
import RelatedReplies from '../RelatedReplies';
import RepliesModal from '../Modal/RepliesModal';
import { nl2br } from '../../util/text';

import { tabMenuStyle } from '../../pages/article.styles';

class SearchArticleItem extends PureComponent {
  state = {
    repliesModalOpen: false,
  };

  handleModalOpen = () => {
    this.setState({
      repliesModalOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      repliesModalOpen: false,
    });
  };

  render() {
    const { repliesModalOpen } = this.state;
    const { article, onConnect } = this.props;
    return (
      <li className="root">
        <button className="btn-sticky" onClick={this.handleModalOpen}>
          查看{article.get('replyCount')}則回覆
          <svg
            className="icon-extend"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm-6 400H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h340a6 6 0 0 1 6 6v340a6 6 0 0 1-6 6zm-54-304l-136 .145c-6.627 0-12 5.373-12 12V167.9c0 6.722 5.522 12.133 12.243 11.998l58.001-2.141L99.515 340.485c-4.686 4.686-4.686 12.284 0 16.971l23.03 23.029c4.686 4.686 12.284 4.686 16.97 0l162.729-162.729-2.141 58.001c-.136 6.721 5.275 12.242 11.998 12.242h27.755c6.628 0 12-5.373 12-12L352 140c0-6.627-5.373-12-12-12z" />
          </svg>
        </button>
        <p>{nl2br(article.get('text'))}</p>
        {repliesModalOpen && (
          <RepliesModal
            replies={article.getIn(['replyConnections'])}
            onModalClose={this.handleModalClose}
            onConnect={onConnect}
          />
        )}
        <style jsx>{`
          .root {
            padding: 24px;
            border: 1px solid #ccc;
            border-top: 0;
          }
          .root:first-child {
            border-top: 1px solid #ccc;
          }
          .root:hover {
            background: rgba(0, 0, 0, 0.05);
          }
          .btn-sticky {
            position: sticky;
            top: 0.3em;
            float: right;
            display: flex;
            flex-dirction: row;
            align-items: center;
            height: 1.6em;
            border-radious: 0.8em;
            cursor: pointer;
          }
          .icon-extend {
            height: 1em;
            width: auto;
            display: inline-block;
            margin-left: 0.5em;
          }
        `}</style>
      </li>
    );
  }
}

const SearchArticles = ({ onConnect, searchArticles }) => {
  return (
    <ul className="items">
      {searchArticles.map(article => {
        return <SearchArticleItem article={article} onConnect={onConnect} />;
      })}
      <style jsx>{`
        .items {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </ul>
  );
};

export default class ReplySearch extends PureComponent {
  state = {
    tab: false, // reply || article
    search: '',
  };

  search = ''; // only use for text similarity compare, so not put it in state

  handleSearch = event => {
    const { target: { value }, key } = event;

    if (key === 'Enter') {
      this.search = value;
      this.props.onSearch(event);
    }
  };

  handleTabChange = tab => () => {
    this.setState({ tab });
  };

  renderTabMenu = () => {
    const { article, reply } = this.props;
    const { tab } = this.state;
    const replyCount = reply.size;
    const articleCount = article.size;

    return (
      <ul className="tabs">
        <li
          onClick={this.handleTabChange('reply')}
          className={`tab ${tab === 'reply' ? 'active' : ''} ${
            replyCount === 0 ? 'disabled' : ''
          }`}
        >
          {replyCount === 0 ? (
            '查無相關文章'
          ) : (
            <span>
              使用相關回應 <span className="badge">{replyCount}</span>
            </span>
          )}
        </li>
        <li
          onClick={this.handleTabChange('article')}
          className={`tab ${tab === 'article' ? 'active' : ''} ${
            articleCount === 0 ? 'disabled' : ''
          }`}
        >
          {articleCount === 0 ? (
            '查無相關文章'
          ) : (
            <span>
              瀏覽相關文章 <span className="badge">{articleCount}</span>
            </span>
          )}
        </li>

        <style jsx>{tabMenuStyle}</style>
      </ul>
    );
  };

  renderSearchReplyTab = () => {
    const { article, reply, onConnect } = this.props;
    const { tab } = this.state;

    const articleText = article.get('text', '');
    const getArticleSimilarity = relatedArticleText =>
      stringSimilarity.compareTwoStrings(this.search, relatedArticleText);

    switch (tab) {
      case 'reply':
        return (
          <RelatedReplies
            onConnect={onConnect}
            relatedReplies={reply}
            getArticleSimilarity={getArticleSimilarity}
          />
        );

      case 'article':
        return (
          <SearchArticles onConnect={onConnect} searchArticles={article} />
        );

      default:
        return null;
    }
  };

  render() {
    const { onSearch } = this.props;
    return (
      <div>
        <label htmlFor="replySeach">
          搜尋相關回應ㄉ：
          <input id="replySeach" type="search" onKeyUp={this.handleSearch} />
        </label>
        {this.renderTabMenu()}
        <div className="tab-content">{this.renderSearchReplyTab()}</div>
        <style jsx>{`
          .tab-content {
            padding: 20px;
            border: 1px solid #ccc;
            border-top: 0;
          }
        `}</style>
      </div>
    );
  }
}

ReplySearch.propTypes = {
  onConnect: PropTypes.func.isRequired, // get replyId by event.target.value for reply connection
  onSearch: PropTypes.func.isRequired,
  article: PropTypes.object.isRequired,
  reply: PropTypes.object.isRequired,
};
