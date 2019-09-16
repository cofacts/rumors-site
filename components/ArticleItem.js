import gql from 'graphql-tag';
import Link from 'next/link';
import ArticleInfo from './ArticleInfo';
import { listItemStyle } from './ListItem.styles';
// import ArticleItemWidget from './ArticleItemWidget/ArticleItemWidget.js';
import cx from 'clsx';

export default function ArticleItem({
  article,
  read = false, // from localEditorHelperList, it only provide after did mount
  notArticleReplied = false, // same as top
  // handleLocalEditorHelperList,
  // isLogin,
}) {
  return (
    <li
      className={cx('item', {
        read: read,
        'not-article': notArticleReplied,
      })}
    >
      <Link href="/article/[id]" as={`/article/${article.id}`}>
        <a>
          <div className="item-text">{article.text}</div>
          <ArticleInfo article={article} />
          {/* {isLogin && (
            <ArticleItemWidget
              id={id}
              read={read}
              notArticleReplied={notArticleReplied}
              onChange={handleLocalEditorHelperList}
            />
          )} */}
        </a>
      </Link>

      <style jsx>{listItemStyle}</style>
    </li>
  );
}

ArticleItem.fragments = {
  articleItem: gql`
    fragment ArticleItem on Article {
      id
      text
      ...ArticleInfo
    }
    ${ArticleInfo.fragments.articleInfo}
  `,
};
