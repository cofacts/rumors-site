import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    margin: '24px 0 20px',
    alignItems: 'center',
    justifyContent: 'center',

    '& > h1': {
      fontSize: 18,
      fontWeight: 500,
      margin: '0 22px 0 0',
    },

    [theme.breakpoints.up('md')]: {
      margin: '48px 0 24px',
      '& > h1': {
        fontSize: 34,
      },
      justifyContent: 'space-between',
    },
  },
}));

function ListPageHeader({ title, children, className }) {
  const classes = useStyles();
  return (
    <header className={cx(className, classes.root)}>
      <h1>{title}</h1>
      {children}
    </header>
  );
}

export default ListPageHeader;
