import React from 'react';
import { Link } from '../routes';
import ArticleInfo from './ArticleInfo';
import { listItemStyle } from './ListItem.styles';

export default function ArticleItem({ article }) {
  return (
    <Link route="article" params={{ id: article.get('id') }}>
      <li className="item">
        <a>
          <div className="item-text">{article.get('text')}</div>
          <ArticleInfo article={article} />
        </a>

        <style jsx>{listItemStyle}</style>
      </li>
    </Link>
  );
}
