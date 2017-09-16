import React from 'react';
import { Link } from '../routes';
import ArticleInfo from './ArticleInfo';
import { listItemStyle } from './ListItem.styles';

export default function ArticleItem({ article }) {

  return (
    <Link route='article' params={{id: article.get('id')}}>
      <a className="item">
        <div className="item-text">{article.get('text')}</div>
        <ArticleInfo article={article} />

        <style jsx>{listItemStyle}</style>
      </a>
    </Link>
  );
}
