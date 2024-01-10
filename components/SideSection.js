import { withStyles } from '@material-ui/core/styles';

import cx from 'clsx';

export const SideSection = withStyles(theme => ({
  aside: {
    [theme.breakpoints.up('md')]: {
      padding: '0 20px',
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(({ classes, children, className, ...props }) => {
  return (
    <aside className={cx(classes.aside, className)} {...props}>
      {children}
    </aside>
  );
});

export const SideSectionHeader = withStyles(theme => ({
  asideHeader: {
    lineHeight: '20px',
    padding: '12px 0',
    fontWeight: 700,
    [theme.breakpoints.up('md')]: {
      padding: '20px 0 12px',
      borderBottom: `1px solid ${theme.palette.secondary[500]}`,
    },
  },
}))(({ classes, children, className, ...props }) => {
  return (
    <header className={cx(classes.asideHeader, className)} {...props}>
      {children}
    </header>
  );
});

export const SideSectionLinks = withStyles(theme => ({
  asideItems: {
    display: 'flex',
    flexFlow: 'row',
    overflowX: 'auto',

    '--gutter': `${theme.spacing(2)}px`,
    margin: `0 calc(-1 * var(--gutter))`,
    padding: `0 var(--gutter)`,

    '&::after': {
      // Right-most gutter after the last item
      content: '""',
      flex: '0 0 var(--gutter)',
    },

    [theme.breakpoints.up('sm')]: {
      '--gutter': `${theme.spacing(3)}px`,
    },
    [theme.breakpoints.up('md')]: {
      '--gutter': 0,
      flexFlow: 'column',
      overflowX: 'visible',
      '&::after': {
        display: 'none',
      },
    },
  },
}))(({ classes, children, className, ...props }) => {
  return (
    <div className={cx(classes.asideItems, className)} {...props}>
      {children}
    </div>
  );
});

export const SideSectionLink = withStyles(theme => ({
  asideItem: {
    // override <a> defaults
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',

    [theme.breakpoints.down('sm')]: {
      padding: 16,
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      flex: '0 0 320px',
      maxWidth: '66vw',
      '& + &': {
        marginLeft: 12,
      },
    },

    [theme.breakpoints.up('md')]: {
      padding: '16px 0',
      '& + &': {
        borderTop: `1px solid ${theme.palette.secondary[100]}`,
      },
    },
  },
}))(({ classes, children, className, ...props }) => {
  return (
    <a className={cx(classes.asideItem, className)} {...props}>
      {children}
    </a>
  );
});

export const SideSectionText = withStyles(() => ({
  asideText: {
    display: '-webkit-box',
    overflow: 'hidden',
    boxOrient: 'vertical',
    textOverflow: 'ellipsis',
    lineClamp: 5,
  },
}))(({ classes, children, className, ...props }) => {
  return (
    <article className={cx(classes.asideText, className)} {...props}>
      {children}
    </article>
  );
});
