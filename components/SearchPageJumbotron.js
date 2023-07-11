import { useRef, useEffect, memo } from 'react';
import { useRouter } from 'next/router';
import { t } from 'ttag';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Box, Container } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  jumbotron: {
    background: '#202020',
  },
  search: {
    color: theme.palette.common.white,
    paddingRight: theme.spacing(3),
  },
  form: {
    padding: '56px 0',
    display: 'flex',
    alignItems: 'baseline',
  },
  inputArea: {
    position: 'relative',
    background: theme.palette.secondary[400],
    border: `1px dashed ${theme.palette.secondary[200]}`,
    borderRadius: 8,
    padding: theme.spacing(1),
    '&:before, &:after': {
      display: 'block',
      position: 'absolute',
      color: '#B9B9B9',
      fontSize: '2rem',
    },
    '&:before': {
      content: '"“"',
      top: -theme.spacing(1),
      left: -theme.spacing(2),
    },
    '&:after': {
      content: '"”"',
      bottom: -theme.spacing(3),
      right: -theme.spacing(2),
    },
    '&:focus-within': {
      border: `1px solid ${theme.palette.primary[500]}`,
      '& $submit': {
        display: 'block',
      },
    },
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    color: theme.palette.common.white,
    background: 'transparent',
  },
  submit: {
    display: 'none',
    outline: 'none',
    cursor: 'pointer',
    height: '100%',
    position: 'absolute',
    border: `1px solid ${theme.palette.primary[500]}`,
    top: 0,
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    background: theme.palette.primary[500],
    color: theme.palette.common.white,
    '& > svg': {
      verticalAlign: 'middle',
    },
  },
}));

const CustomTab = withStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    fontSize: theme.typography.htmlFontSize,
  },
}))(Tab);

function SearchPageJumbotron() {
  const router = useRouter();
  const { query } = router;
  const textareaRef = useRef(null);

  const classes = useStyles();

  const onSearch = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/search',
      query: { ...query, q: e.target.search.value },
    });
  };

  const { q } = query;
  useEffect(() => {
    textareaRef.current.value = q;
  }, [q]);

  const navigate = (type) =>
    router.push({ pathname: '/search', query: { ...query, type } });

  return (
    <div className={classes.jumbotron}>
      <Container>
        <form onSubmit={onSearch} className={classes.form}>
          <h2 className={classes.search}>{t`Searching`}</h2>
          <Box flex={1} className={classes.inputArea}>
            <textarea
              ref={textareaRef}
              name="search"
              className={classes.input}
              rows={1}
            />
            <button type="submit" className={classes.submit}>
              <SearchIcon />
            </button>
          </Box>
        </form>
        <Tabs
          value={query.type}
          onChange={(e, page) => navigate(page)}
          indicatorColor="primary"
          textColor="primary"
          aria-label="tabs"
        >
          <CustomTab value="messages" label={t`Messages`} />
          <CustomTab value="replies" label={t`Replies`} />
        </Tabs>
      </Container>
    </div>
  );
}

export default memo(SearchPageJumbotron);
