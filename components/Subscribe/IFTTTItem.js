import { useState, forwardRef } from 'react';
import { t } from 'ttag';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { ButtonIcon } from './FeedDisplayComponents';

import copy from 'copy-to-clipboard';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 730,
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 7),
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  },
  close: {
    position: 'absolute',
    top: `2%`,
    right: `2%`,
  },
  youtube: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    marginTop: 20,
    marginBottom: 20,
    '& .iframe': {
      position: 'absolute',
      top: '0',
    },
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '4px',
    borderStyle: 'hidden',
    boxShadow: '0 0 0 1px #ddd',
    marginTop: 20,
    marginBottom: 20,
    '& td': {
      border: '1px solid #ddd',
      textAlign: 'center',
    },
  },
  textField: { padding: '0 14px' },
}));

const ModalBody = forwardRef(function ModalBody(props, ref) {
  const { IFTTTAppletUrl, feedUrl, tutorialYoutubeId, platform, close } = props;
  const classes = useStyles();
  return (
    <div ref={ref} className={classes.paper} tabIndex={-1}>
      <IconButton className={classes.close} onClick={close}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h5">{t`Subscribe to ${platform}`}</Typography>
      <div className={classes.youtube}>
        <iframe
          className="iframe"
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${tutorialYoutubeId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <table className={classes.table}>
        <tbody>
          <tr>
            <td>
              <Box px={1}>
                <Typography variant="body1">{t`Feed URL`}</Typography>
              </Box>
            </td>
            <td className={classes.textField}>
              <TextField
                defaultValue={feedUrl}
                InputProps={{ readOnly: true, disableUnderline: true }}
                onFocus={e => e.target.select()}
                fullWidth
              />
            </td>
            <td>
              <Button onClick={() => copy(feedUrl)}>{t`Copy`}</Button>
            </td>
          </tr>
        </tbody>
      </table>
      <Button
        variant="contained"
        color="default"
        component="a"
        href={IFTTTAppletUrl}
        target="_blank"
        rel="noopener noreferrer"
        fullWidth
        size="large"
      >
        {t`Subscribe`}
      </Button>
    </div>
  );
});

function IFTTTItem({
  feedUrl,
  IFTTTAppletUrl,
  children,
  icon,
  tutorialYoutubeId,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ButtonIcon icon={icon} onClick={handleOpen}>
        {children}
      </ButtonIcon>
      <Modal open={open} onClose={handleClose}>
        <ModalBody
          platform={children}
          feedUrl={feedUrl}
          IFTTTAppletUrl={IFTTTAppletUrl}
          tutorialYoutubeId={tutorialYoutubeId}
          close={handleClose}
        />
      </Modal>
    </>
  );
}

IFTTTItem.displayName = 'IFTTTItem';

export default IFTTTItem;
