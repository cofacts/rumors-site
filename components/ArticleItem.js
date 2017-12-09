import React from 'react';
import { Link } from '../routes';
import ArticleInfo from './ArticleInfo';
import { listItemStyle } from './ListItem.styles';
import ArticleItemWidget from './ArticleItemWidget/ArticleItemWidget.js';
import cx from 'classnames';

export default function ArticleItem({
  article,
  read = false, // from localEditorHelperList, it only provide after did mount
  notArticleReplied = false, // same as top
  handleLocalEditorHelperList,
}) {
  const id = article.get('id');
  return (
    <li
      className={cx('item', {
        read: read,
        notArticle: notArticleReplied,
      })}
    >
      <Link route="article" params={{ id }}>
        <a>
          <div className="item-text">{article.get('text')}</div>
          <ArticleInfo article={article} />
          <ArticleItemWidget
            id={id}
            read={read}
            notArticleReplied={notArticleReplied}
            handleLocalEditorHelperList={handleLocalEditorHelperList}
          />
        </a>
      </Link>

      <style jsx>{listItemStyle}</style>
    </li>
  );
}
