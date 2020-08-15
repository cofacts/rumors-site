import { useState, forwardRef, memo } from 'react';
import { t } from 'ttag';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { ButtonIcon } from './FeedDisplayComponents';

import CopyButton from '../CopyButton';

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(3, 7),
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
    marginTop: 16,
    marginBottom: 16,
    '& .iframe': {
      position: 'absolute',
      top: '0',
    },
  },
  textField: { padding: '0 14px' },
}));

const DialogBody = forwardRef(function DialogBody(props, ref) {
  const { IFTTTAppletUrl, feedUrl, tutorialYoutubeId, platform, close } = props;
  const classes = useStyles();

  return (
    <div ref={ref} className={classes.dialog}>
      <IconButton className={classes.close} onClick={close}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h5">{t`Subscribe to ${platform}`}</Typography>
      {tutorialYoutubeId ? (
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
      ) : null}
      <Box
        display="flex"
        alignItems="stretch"
        borderRadius={4}
        border="1px solid #ddd"
        marginBottom={2}
      >
        <Box
          display="flex"
          alignItems="center"
          p={1}
          borderRight="1px solid #ddd"
        >
          <Typography noWrap variant="body1">{t`Feed URL`}</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          px={1}
          borderRight="1px solid #ddd"
        >
          <TextField
            defaultValue={feedUrl}
            InputProps={{ readOnly: true, disableUnderline: true }}
            onFocus={e => e.target.select()}
            fullWidth
          />
        </Box>
        <Box display="flex" alignItems="center">
          <CopyButton content={feedUrl}>{t`Copy`}</CopyButton>
        </Box>
      </Box>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogBody
          platform={children}
          feedUrl={feedUrl}
          IFTTTAppletUrl={IFTTTAppletUrl}
          tutorialYoutubeId={tutorialYoutubeId}
          close={handleClose}
        />
      </Dialog>
    </>
  );
}

IFTTTItem.displayName = 'IFTTTItem';

export default memo(IFTTTItem);
