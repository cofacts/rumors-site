import { useState } from 'react';
import { t } from 'ttag';
import gql from 'graphql-tag';
import Link from 'next/link';

import { useMutation } from '@apollo/react-hooks';
import { dataIdFromObject } from 'lib/apollo';
import ArticleCategory from './ArticleCategory';
import useCurrentUser from 'lib/useCurrentUser';

import {
  Box,
  Chip,
  Typography,
  Divider,
  Badge,
  Snackbar,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import DownVoteDialog from './DownVoteDialog';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  badge: {
    transform: 'scale(1) translate(0, -50%)',
    color: theme.palette.common.white,
  },
  name: {
    background: ({ marked }) =>
      marked ? theme.palette.secondary[50] : theme.palette.common.white,
    border: `1px solid ${theme.palette.secondary[100]}`,
  },
  action: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: theme.palette.secondary[300],
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  voteButton: {
    background: theme.palette.common.white,
    color: theme.palette.secondary[200],
    border: `1px solid ${theme.palette.secondary[100]}`,
    zIndex: 1,
    '&[aria-disabled="true"]': {
      opacity: 1,
    },
  },
  agree: {
    color: theme.palette.primary[500],
    border: `1px solid ${theme.palette.primary[500]}`,
  },
  disagree: {
    color: '#966DEE',
    border: `1px solid #966DEE`,
  },
  result: {
    flex: 1,
    display: 'flex',
    background: theme.palette.secondary[100],
    margin: `0 -${theme.spacing(1)}px`,
  },
  agreeBar: {
    background: theme.palette.primary[500],
    color: theme.palette.common.white,
    width: ({ positive, allFeedbackCount }) =>
      `${(100 * positive) / allFeedbackCount}%`,
    textAlign: 'center',
  },
  disagreeBar: {
    background: '#966DEE',
    color: theme.palette.common.white,
    width: ({ negative, allFeedbackCount }) =>
      `${(100 * negative) / allFeedbackCount}%`,
    textAlign: 'center',
  },

  example: {
    color: theme.palette.secondary[500],
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },
}));

const ArticleWithCategories = gql`
  fragment ArticleWithCategories on Article {
    articleCategories {
      ...ArticleCategoryData
    }
  }
  ${ArticleCategory.fragments.ArticleCategoryData}
`;

const ADD_CATEGORY = gql`
  mutation AddCategoryToArticle($articleId: String!, $categoryId: String!) {
    CreateArticleCategory(articleId: $articleId, categoryId: $categoryId) {
      articleId
      categoryId
      ...ArticleCategoryData
    }
  }
  ${ArticleCategory.fragments.ArticleCategoryData}
`;

const DELETE_CATEGORY = gql`
  mutation RemoveCategoryFromArticle(
    $articleId: String!
    $categoryId: String!
  ) {
    UpdateArticleCategoryStatus(
      articleId: $articleId
      categoryId: $categoryId
      status: DELETED
    ) {
      articleId
      categoryId
      status
    }
  }
`;

const VOTE_CATEGORY = gql`
  mutation VoteArticleCategory(
    $articleId: String!
    $categoryId: String!
    $vote: FeedbackVote!
    $comment: String
  ) {
    CreateOrUpdateArticleCategoryFeedback(
      articleId: $articleId
      categoryId: $categoryId
      vote: $vote
      comment: $comment
    ) {
      articleId
      categoryId

      ...ArticleCategoryData
    }
  }
  ${ArticleCategory.fragments.ArticleCategoryData}
`;

/**
 * @param {Category} props.category
 * @param {null|string} vote
 * @param {bool} marked
 */
function CategoryOption({
  user: author,
  category,
  articleId,
  feedback = {},
  marked,
}) {
  const { positive, negative, ownVote } = feedback;

  const allFeedbackCount = ~~(positive + negative);

  const user = useCurrentUser();

  const [showVoteSnack, setVoteSnackShow] = useState(false);
  const [showDownVoteDialog, setDownVoteDialogShow] = useState(false);
  const [addCategory, { loading }] = useMutation(ADD_CATEGORY, {
    update(
      cache,
      {
        data: { CreateArticleCategory },
      }
    ) {
      // Read & update Article instance
      const id = dataIdFromObject({ __typename: 'Article', id: articleId });
      const article = cache.readFragment({
        id,
        fragmentName: 'ArticleWithCategories',
        fragment: ArticleCategory.fragments.ArticleWithCategories,
      });

      cache.writeFragment({
        id: dataIdFromObject({ __typename: 'Article', id: articleId }),
        fragmentName: 'ArticleWithCategories',
        fragment: ArticleCategory.fragments.ArticleWithCategories,
        data: {
          ...article,
          articleCategories: CreateArticleCategory,
        },
      });
    },
  });

  const [deleteCategory, { loading: deletingCategory }] = useMutation(
    DELETE_CATEGORY,
    {
      variables: { articleId, categoryId: category.id },
      update(
        cache,
        {
          data: { UpdateArticleCategoryStatus },
        }
      ) {
        // Process data returned from mutation into a categoryId -> is-normal map
        const categoryIsNormal = UpdateArticleCategoryStatus.reduce(
          (map, { categoryId, status }) => {
            map[categoryId] = status === 'NORMAL';
            return map;
          },
          {}
        );

        // Read & update Article instance
        const id = dataIdFromObject({ __typename: 'Article', id: articleId });
        const article = cache.readFragment({
          id,
          fragmentName: 'ArticleWithCategories',
          fragment: ArticleWithCategories,
        });
        cache.writeFragment({
          id,
          fragmentName: 'ArticleWithCategories',
          fragment: ArticleWithCategories,
          data: {
            ...article,
            articleCategories: article.articleCategories.filter(
              ({ categoryId }) => categoryIsNormal[categoryId]
            ),
          },
        });
      },
    }
  );
  const [voteCategory, { loading: votingCategory }] = useMutation(
    VOTE_CATEGORY,
    {
      onCompleted: () => {
        setVoteSnackShow(true);
      },
    }
  );

  const classes = useStyles({ allFeedbackCount, positive, negative, marked });

  const handleAdd = () => {
    addCategory({ variables: { articleId, categoryId: category.id } });
  };

  const handleVoteUp = () => {
    voteCategory({
      variables: { articleId, categoryId: category.id, vote: 'UPVOTE' },
    });
  };
  const handleVoteDown = comment => {
    voteCategory({
      variables: {
        articleId,
        categoryId: category.id,
        vote: 'DOWNVOTE',
        comment,
      },
    });
    setDownVoteDialogShow(false);
  };
  const ownMark = user && author?.id === user.id;
  return (
    <Box mt={3}>
      <div>
        <Badge
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          badgeContent={marked ? t`Marked` : 0}
          classes={{ badge: classes.badge }}
          color="primary"
        >
          <Chip label={`#${category.title}`} className={classes.name} />
        </Badge>
        {!marked && (
          <button
            type="button"
            className={classes.action}
            disabled={loading}
            onClick={handleAdd}
          >
            {t`Add`}
          </button>
        )}
        {ownMark && (
          <button
            type="button"
            className={classes.action}
            disabled={loading || deletingCategory}
            onClick={deleteCategory}
          >
            {t`Remove`}
          </button>
        )}
      </div>
      {marked && (
        <Box display="flex" alignItems="center" my={1}>
          <Chip
            label={t`Agree`}
            className={cx(
              classes.voteButton,
              ownVote === 'UPVOTE' && classes.agree
            )}
            disabled={votingCategory || ownVote === 'UPVOTE' || ownMark}
            onClick={handleVoteUp}
          />
          <div className={classes.result}>
            {allFeedbackCount && (
              <>
                <div className={classes.agreeBar}>
                  {parseInt((positive / allFeedbackCount) * 100)}%
                </div>
                <div className={classes.disagreeBar}>
                  {parseInt((negative / allFeedbackCount) * 100)}%
                </div>
              </>
            )}
          </div>
          <Chip
            label={t`Disagree`}
            className={cx(
              classes.voteButton,
              ownVote === 'DOWNVOTE' && classes.disagree
            )}
            disabled={votingCategory || ownVote === 'DOWNVOTE' || ownMark}
            onClick={() => setDownVoteDialogShow(true)}
          />
        </Box>
      )}
      <div>
        <Typography variant="body2" color="secondary">
          {category.description}{' '}
          <Link
            href={{
              pathname: '/articles',
              query: { categoryIds: category.id },
            }}
          >
            <a className={classes.example}>{t`See examples`}</a>
          </Link>
        </Typography>
      </div>
      <Divider className={classes.divider} />
      <Snackbar
        open={showVoteSnack}
        onClose={() => setVoteSnackShow(false)}
        message={t`Thank you for the feedback.`}
      />
      {showDownVoteDialog && (
        <DownVoteDialog
          articleId={articleId}
          categoryId={category.id}
          onClose={() => setDownVoteDialogShow(false)}
          onVote={handleVoteDown}
        />
      )}
    </Box>
  );
}

export default CategoryOption;
