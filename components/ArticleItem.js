import React from 'react';
import { Link } from '../routes';
import ArticleInfo from './ArticleInfo';
import { listItemStyle } from './ListItem.styles';

export default function ArticleItem({ article }) {
  return (
    <li className="item">
      <Link route="article" params={{ id: article.get('id') }}>
        <a>
          <div className="item-text">{article.get('text')}</div>
          <ArticleInfo article={article} />
        </a>
      </Link>

      <style jsx>{listItemStyle}</style>
    </li>
  );
}
