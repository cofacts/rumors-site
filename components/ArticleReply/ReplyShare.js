import { useState } from 'react';
import {
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  Snackbar,
} from '@material-ui/core';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import CopyButton from '../CopyButton';

const useStyles = makeStyles(theme => ({
  button: ({ open }) => ({
    fontSize: theme.typography.htmlFontSize,
    borderRadius: 45,
    padding: '1px 8px',
    outline: 'none',
    cursor: 'pointer',
    marginLeft: 2,
    border: `1px solid ${
      open ? theme.palette.primary[500] : theme.palette.secondary[100]
    }`,
    color: open ? theme.palette.primary[500] : theme.palette.secondary[200],
    background: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      padding: '4px 18px',
      marginRight: 10,
      marginLeft: 12,
    },
    '&:hover': {
      border: `1px solid ${theme.palette.secondary[300]}`,
      color: theme.palette.secondary[300],
    },
  }),
  menu: {
    marginTop: 40,
  },
}));

const SUCCESS = 'SUCCESS';

const ReplyShare = ({ copyText }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const classes = useStyles({ open: !!anchorEl });

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const onSuccess = text => {
    setMessage(text);
    setStatus(SUCCESS);
    closeMenu();
  };

  const handleShare = event => {
    if (window.navigator && window.navigator.share) {
      navigator
        .share({ text: copyText })
        .then(() => onSuccess(t`Successfylly Shared!`))
        .catch(() => {});
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
      <button type="button" className={classes.button} onClick={handleShare}>
        {t`Share`}
      </button>
      <Popper id="share" open={!!anchorEl} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={closeMenu}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={3}>
                <CopyButton content={copyText}>{t`Copy`}</CopyButton>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
      <Snackbar
        onClose={() => setStatus(null)}
        open={status === SUCCESS}
        message={message}
        autoHideDuration={3000}
      />
    </>
  );
};

export default ReplyShare;
