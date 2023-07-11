import { forwardRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import MuiCardContent from '@material-ui/core/CardContent';

import cx from 'clsx';

/**
 * Provides custom CSS property --card-px
 */
export const Card = withStyles((theme) => ({
  root: {
    overflow: 'visible',
    '--card-px': '16px',
    [theme.breakpoints.up('md')]: {
      '--card-px': '36px',
    },
  },
  // eslint-disable-next-line react/display-name
}))(forwardRef((props, ref) => <MuiCard ref={ref} elevation={0} {...props} />));

export const CardHeader = withStyles((theme) => ({
  root: {
    margin: '0 var(--card-px)',
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

export const CardContent = withStyles((theme) => ({
  root: {
    wordBreak: 'break-word',
    padding: '16px 0',
    margin: '0 var(--card-px)',
    [theme.breakpoints.up('md')]: {
      padding: '24px 0',
    },

    '& + &': {
      borderTop: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
}))(MuiCardContent);
