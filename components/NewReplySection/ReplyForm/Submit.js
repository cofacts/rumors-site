import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.primary[500],
    color: theme.palette.common.white,
    padding: '5px 16px',
    borderRadius: 30,
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      padding: '10px 45px',
      fontSize: 18,
    },
  },
}));

export default function Submit(props) {
  const classes = useStyles();

  return (
    <button
      className={classes.root}
      type="submit"
      {...props}
    >{t`Submit`}</button>
  );
}
