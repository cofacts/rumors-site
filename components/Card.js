import { withStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import MuiCardContent from '@material-ui/core/CardContent';

import cx from 'clsx';

export function Card(props) {
  return <MuiCard elevation={0} {...props} />;
}

export const CardHeader = withStyles(theme => ({
  root: {
    margin: '0 16px',
    padding: '12px 0 8px',
    fontSize: 12,
    lineHeight: '20px',
    fontWeight: 700,
    letterSpacing: 0.25,
    color: theme.palette.secondary[500],
    borderBottom: `1px solid ${theme.palette.secondary[500]}`,

    [theme.breakpoints.up('md')]: {
      margin: '0 36px',
      padding: '20px 0 12px',
      fontSize: 14,
    },
  },
}))(({ classes, children, className, ...props }) => {
  return (
    <header className={cx(classes.root, className)} {...props}>
      {children}
    </header>
  );
});

export const CardContent = withStyles(theme => ({
  root: {
    // Card has 16px padding in mobile already
    [theme.breakpoints.up('md')]: {
      padding: '20px 36px 24px',
    },
  },
}))(MuiCardContent);
