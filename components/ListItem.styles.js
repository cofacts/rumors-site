// @todo: deprecated. remove this after finishing UserArticleItem UI upgrade.
import css from 'styled-jsx/css';

export const listItemStyle = css`
  .item {
    --font-size: 0.8em; // for ArticleInfo && articleItemWidget layout
    --list-item-padding: 8px;
    display: block;
    position: relative;
    padding: var(--list-item-padding) 0;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: rgba(0, 0, 0, 0.88);
    cursor: pointer;
  }
  .item.read {
    background-color: #f1f1f1;
    color: rgba(0, 0, 0, 0.3);
  }
  .item.not-article {
    background-color: #feff3b45;
  }
  .item:hover {
    color: rgba(0, 0, 0, 0.56);
  }
  .item:first-child {
    border: 0;
  }
  .item-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;
