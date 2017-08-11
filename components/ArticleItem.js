import React from 'react';
import Link from 'next/link';
import ArticleInfo from './ArticleInfo';

export default function ArticleItem({ article }) {
  return (
    <Link
      href={`/article?id=${article.get('id')}`}
      as={`/article/${article.get('id')}`}
    >
      <a className="article">
        <div className="text">{article.get('text')}</div>
        <ArticleInfo article={article} />

        <style jsx>{`
          .article {
            display: block;
            padding: 8px 0;
            border-top: 1px solid rgba(0, 0, 0, .2);
            text-decoration: none;
            color: rgba(0, 0, 0, .88);
          }
          .article:hover {
            color: rgba(0, 0, 0, .56);
          }
          .article:first-child {
            border: 0;
          }
          .text {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        `}</style>
      </a>
    </Link>
  );
}
