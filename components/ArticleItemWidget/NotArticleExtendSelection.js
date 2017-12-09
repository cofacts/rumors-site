import React from 'react';

import { TYPE_SUGGESTION_OPTIONS } from '../../constants/replyType';

const NotArticleExtendSelection = ({ replyToNotArticle }) => {
  return (
    <ul className="extend">
      {TYPE_SUGGESTION_OPTIONS.NOT_ARTICLE.map(({ label, value }, index) => (
        <li
          key={'op' + index}
          className="option"
          onClick={() => {
            replyToNotArticle(value);
          }}
          onTouchStart={event => event.stopPropagation()} // prevent it trigger ul onTouchStart openBar
          onTouchEnd={event => event.stopPropagation()} // prevent it trigger ul onBarTouchEnd
        >
          {label}
        </li>
      ))}
      <style jsx>{`
        .extend {
          position: absolute;
          z-index: 2;
          top: 100%;
          right: 0;
          padding: 1em;
          background: white;
          border: 1px solid black;
        }
        .option {
          cusor: pointer;
          white-space: nowrap;
          list-style: none;
        }
        .option:hover {
          color: orange;
        }
      `}</style>
    </ul>
  );
};

export default NotArticleExtendSelection;
