import { t } from 'ttag';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Link from 'next/link';

import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { dataIdFromObject } from 'lib/apollo';
import ArticleCategory from './ArticleCategory';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  dialogContent: {
    backgroundColor: '#eee',
  },
  gridItem: {
    minWidth: 0,
  },
  card: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
  cardFooter: {
    marginTop: 'auto',
  },
}));

const CategoryData = gql`
  fragment CategoryData on Category {
    id
    title
    description
  }
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

/**
 * @param {Category} props.category
 * @param {boolean} isSelected
 * @param {boolean} disabled
 * @param {string => void} onAdd
 */
function CategoryOption({ category, selected, onAdd, disabled }) {
  const classes = useStyles();

  const handleClick = () => {
    onAdd(category.id);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component="h2" variant="h6">
          {category.title}
        </Typography>
        <Typography variant="subtitle1">{category.description}</Typography>
      </CardContent>
      <CardActions className={classes.cardFooter}>
        <Button
          size="small"
          disabled={disabled || selected}
          onClick={handleClick}
          color="primary"
          variant="contained"
        >
          {selected ? t`Added` : t`Add`}
        </Button>
        <Link
          href={{ pathname: '/articles', query: { c: category.id } }}
          passHref
        >
          <Button size="small">{t`See examples`}</Button>
        </Link>
      </CardActions>
    </Card>
  );
}

/**
 * @param {string} props.articleId
 * @param {Category[]} props.allCategories
 * @param {ArticleCategory[]} props.articleCategories
 * @param {() => void} props.onClose
 */
function AddCategoryDialog({
  articleId,
  allCategories,
  articleCategories,
  onClose = () => {},
}) {
  const classes = useStyles();

  const [addCategory, { loading }] = useMutation(ADD_CATEGORY, {
    onCompleted: onClose,
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

  const handleAdd = categoryId => {
    addCategory({ variables: { articleId, categoryId } });
  };

  const isSelectedMap = articleCategories.reduce((map, ac) => {
    map[ac.categoryId] = true;
    return map;
  }, {});

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="add-category-dialog-title"
      open
      maxWidth="lg"
    >
      <DialogTitle id="add-category-dialog-title">{t`Categorize this message`}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={1}>
          {allCategories.map(category => (
            <Grid
              item
              key={category.id}
              xs={12}
              md={6}
              lg={4}
              className={classes.gridItem}
            >
              <CategoryOption
                category={category}
                onAdd={handleAdd}
                selected={isSelectedMap[category.id]}
                disabled={loading}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

AddCategoryDialog.fragments = { CategoryData };

export default AddCategoryDialog;
