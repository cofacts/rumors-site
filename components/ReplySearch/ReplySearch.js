import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import stringSimilarity from 'string-similarity';
import RelatedReplies from '../RelatedReplies';
import SearchArticleItem from './SearchArticleItem.js';

import { tabMenuStyle } from '../../pages/article.styles';

const SearchArticles = ({ onConnect, searchArticles }) => {
  return (
    <ul className="items">
      {searchArticles.map(article => {
        return (
          <SearchArticleItem
            key={article.get('id')}
            article={article}
            onConnect={onConnect}
          />
        );
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

  handleSearch = event => {
    const {
      target: { value },
      key,
    } = event;

    if (key === 'Enter') {
      this.setState({ search: value });
      this.props.onSearch(event);
    }
  };

  handleTabChange = tab => () => {
    this.setState({ tab });
  };

  renderTabMenu = () => {
    const { articles, replies } = this.props;
    const { tab } = this.state;
    const replisCount = replies.size;
    const articlesCount = articles.size;

    return (
      <ul className="tabs">
        <li
          onClick={this.handleTabChange('reply')}
          className={`tab ${tab === 'reply' ? 'active' : ''} ${
            replisCount === 0 ? 'disabled' : ''
          }`}
        >
          {replisCount === 0 ? (
            '查無相關文章'
          ) : (
            <span>
              使用相關回應 <span className="badge">{replisCount}</span>
            </span>
          )}
        </li>
        <li
          onClick={this.handleTabChange('article')}
          className={`tab ${tab === 'article' ? 'active' : ''} ${
            articlesCount === 0 ? 'disabled' : ''
          }`}
        >
          {articlesCount === 0 ? (
            '查無相關文章'
          ) : (
            <span>
              瀏覽相關文章 <span className="badge">{articlesCount}</span>
            </span>
          )}
        </li>
        <li className="empty" />
        <style jsx>{`
          .tabs {
            margin-top: 20px;
          }
        `}</style>
        <style jsx>{tabMenuStyle}</style>
      </ul>
    );
  };

  renderSearchReplyTab = () => {
    const { articles, replies, onConnect } = this.props;
    const { tab, search } = this.state;

    const getArticleSimilarity = relatedArticleText =>
      stringSimilarity.compareTwoStrings(search, relatedArticleText);

    switch (tab) {
      case 'reply':
        return (
          <RelatedReplies
            onConnect={onConnect}
            relatedReplies={replies}
            getArticleSimilarity={getArticleSimilarity}
          />
        );

      case 'article':
        return (
          <SearchArticles onConnect={onConnect} searchArticles={articles} />
        );

      default:
        return null;
    }
  };

  render() {
    const { search } = this.state;
    const { articles, replies } = this.props;

    return (
      <div>
        <label htmlFor="replySeach">
          搜尋相關回應：
          <input id="replySeach" type="search" onKeyUp={this.handleSearch} />
        </label>

        {articles.size || replies.size ? (
          <Fragment>
            {this.renderTabMenu()}
            <div key="tab-content" className="tab-content">
              {this.renderSearchReplyTab()}
            </div>
          </Fragment>
        ) : (
          search && (
            <div className="search-none">{`- 找無${search}相關的回覆與文章 -`}</div>
          )
        )}

        <style jsx>{`
          .tab-content {
            padding: 20px;
            border: 1px solid #ccc;
            border-top: 0;
          }
          .search-none {
            margin-top: 20px;
            color: gray;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

ReplySearch.propTypes = {
  onConnect: PropTypes.func.isRequired, // get replyId by event.target.value for reply connection
  onSearch: PropTypes.func.isRequired,
  articles: PropTypes.object.isRequired,
  replies: PropTypes.object.isRequired,
};
