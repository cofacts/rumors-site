import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => {
  const RibbonColorMap = {
    yellow: {
      main: theme.palette.primary[500],
      shadow: theme.palette.primary[700],
    },
    blue: {
      main: theme.palette.common.blue3,
      shadow: theme.palette.common.blue1,
    },
  };

  return {
    root: {
      position: 'relative',
      left: -8,

      backgroundColor: ({ ribbonTheme }) => RibbonColorMap[ribbonTheme].main,
      color: theme.palette.secondary.main,
      width: 'fit-content',

      '&:before': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        borderTop: ({ ribbonTheme }) =>
          `8px solid ${RibbonColorMap[ribbonTheme].shadow}`,
        borderLeft: '8px solid transparent',
      },
    },

    tail: {
      position: 'absolute',
      left: '100%',
      top: 0,
      height: '100%',

      '& > path': {
        fill: ({ ribbonTheme }) => RibbonColorMap[ribbonTheme].main,
      },
    },
  };
});

function Ribbon({ className, theme = 'yellow', children, ...props }, ref) {
  const classes = useStyles({ ribbonTheme: theme });
  return (
    <aside className={cx(classes.root, className)} ref={ref} {...props}>
      {children}
      <svg className={cx(classes.tail)} viewBox="0 0 1 2">
        <path d="M0 0 H1 L0 1 L1 2 H0 Z" />
      </svg>
    </aside>
  );
}

export default forwardRef(Ribbon);
