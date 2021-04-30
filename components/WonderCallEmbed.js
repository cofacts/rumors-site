import { useState } from 'react';
import { t } from 'ttag';
import NoSsr from '@material-ui/core/NoSsr';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MaterialUITooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    left: 20,
    bottom: 20,
  },

  iframe: {
    border: 0,
  },

  container: {
    position: 'relative', // for .cover
  },

  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
  },
}));

const Tooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    boxShadow: theme.shadows[1],
    maxWidth: 336, // 320 + 8 * 2
  },
}))(MaterialUITooltip);

function WonderCallIframe() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const src = `https://tico.chat/powercall/schedule-lite?supportName=Cofacts&supportEmail=cofacts%40googlegroups.com&customDomain=&topic=&clientDeliveryName=Cofacts+%E5%B7%A5%E4%BD%9C%E5%B0%8F%E7%B5%84&brandColor=FFB600&secondBrandColor=333333&entry=wondercall&defaultCam=false&defaultMic=false&origin=${origin}`;

  return (
    <div className={classes.container}>
      {loading && (
        <div className={classes.cover}>{t`Loading contact form`}</div>
      )}
      <iframe
        src={src}
        height="480"
        width="320"
        className={classes.iframe}
        allow="autoplay;encrypted-media;camera;microphone"
        allowFullScreen
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

function WonderCallEmbed() {
  const classes = useStyles();
  const [show, setShow] = useState(false);

  return (
    <NoSsr>
      <ClickAwayListener onClickAway={() => setShow(false)}>
        <Tooltip
          open={show}
          title={<WonderCallIframe />}
          onClose={() => setShow(false)}
          disableHoverListener
          disableFocusListener
          disableTouchListener
          interactive
        >
          <Fab
            size="small"
            variant="round"
            aria-label="WonderCall"
            data-ga="WonderCall"
            className={classes.root}
            target="_blank"
            onClick={() => setShow(show => !show)}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      </ClickAwayListener>
    </NoSsr>
  );
}

export default WonderCallEmbed;
