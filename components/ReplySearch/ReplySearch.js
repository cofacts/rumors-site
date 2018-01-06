import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import stringSimilarity from 'string-similarity';
import RelatedReplies from '../RelatedReplies';

import { tabMenuStyle } from '../../pages/article.styles';

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
            '查無相關回應'
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
        return 'Test';

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
