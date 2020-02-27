import { useState } from 'react';
import gql from 'graphql-tag';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { t } from 'ttag';

const useStyles = makeStyles(theme => ({
  button: { marginTop: theme.spacing(1) },
  buttonIcon: { marginRight: theme.spacing(1) },
  category: { marginRight: theme.spacing(1), marginTop: theme.spacing(1) },
}));

const ArticleCategoriesData = gql`
  fragment ArticleCategoriesData on ArticleCategory {
    articleId
    categoryId
    category {
      title
      description
    }
  }
`;

function Category({ category }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const handleOpen = e => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Chip
        className={classes.category}
        label={category.title}
        onClick={handleOpen}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
}

function ArticleCategories({ articleId, articleCategories }) {
  const classes = useStyles();

  return (
    <aside>
      {(articleCategories || []).map(({ categoryId, category }) => (
        <Category key={categoryId} category={category} />
      ))}

      <Button className={classes.button}>
        <AddIcon className={classes.buttonIcon} />
        {t`Add category`}
      </Button>
    </aside>
  );
}

ArticleCategories.fragments = {
  ArticleCategoriesData,
};

export default ArticleCategories;
