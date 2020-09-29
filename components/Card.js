import { withStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import MuiCardContent from '@material-ui/core/CardContent';

import cx from 'clsx';

/**
 * Provides custom CSS property --horizontal-padding
 */
export const Card = withStyles(theme => ({
  root: {
    '--horizontal-padding': '16px',
    [theme.breakpoints.up('md')]: {
      '--horizontal-padding': '36px',
    },
  },
}))(props => <MuiCard elevation={0} {...props} />);

export const CardHeader = withStyles(theme => ({
  root: {
    margin: '0 var(--horizontal-padding)',
    padding: '12px 0 8px',
    fontSize: 12,
    lineHeight: '20px',
    fontWeight: 700,
    letterSpacing: 0.25,
    color: theme.palette.secondary[500],
    borderBottom: `1px solid ${theme.palette.secondary[500]}`,

    [theme.breakpoints.up('md')]: {
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
    padding: '16px var(--horizontal-padding)',
    [theme.breakpoints.up('md')]: {
      padding: '20px var(--horizontal-padding) 24px',
    },
  },
}))(MuiCardContent);
