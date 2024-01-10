import gql from 'graphql-tag';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

import { ellipsis } from 'lib/text';

const useStyles = makeStyles(() => ({
  thumbnail: {
    maxWidth: '100%',
    maxHeight: '8em', // So that image don't take too much space (more than replies)
  },
}));

/**
 *
 * @param {ThumbnailArticleData} props.article
 * @param {string} props.className - for replaced elements like image and video
 */
function Thumbnail({ article, className }) {
  const classes = useStyles();
  const thumbnailCls = cx(classes.thumbnail, className);

  switch (article.articleType) {
    case 'IMAGE': {
      const altText = ellipsis(article.text ?? '', { wordCount: 40 });
      return (
        <img
          className={thumbnailCls}
          src={article.thumbnailUrl}
          alt={altText}
        />
      );
    }
    case 'VIDEO':
      return !article.thumbnailUrl ? (
        <>{t`A video` + ` (${t`Preview not supported yet`})`}</>
      ) : (
        <video
          className={thumbnailCls}
          src={article.thumbnailUrl}
          autoPlay
          playsInline
          loop
          muted
        />
      );
    case 'AUDIO':
      return !article.thumbnailUrl ? (
        <>{t`An audio` + ` (${t`Preview not supported yet`})`}</>
      ) : (
        <audio src={article.thumbnailUrl} controls />
      );
  }

  return null;
}

Thumbnail.fragments = {
  ThumbnailArticleData: gql`
    fragment ThumbnailArticleData on Article {
      articleType
      text
      thumbnailUrl: attachmentUrl(variant: THUMBNAIL)
    }
  `,
};

export default Thumbnail;
