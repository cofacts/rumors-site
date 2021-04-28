import { useState } from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import { makeStyles } from '@material-ui/core/styles';
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
}));

function WonderCallIframe() {
  const classes = useStyles();
  const src = `https://tico.chat/powercall/schedule-lite?supportName=Cofacts&supportEmail=cofacts%40googlegroups.com&customDomain=&topic=&clientDeliveryName=Cofacts+%E5%B7%A5%E4%BD%9C%E5%B0%8F%E7%B5%84&brandColor=FFB600&secondBrandColor=333333&entry=wondercall&defaultCam=false&defaultMic=false&origin=${origin}`;

  return (
    <iframe
      src={src}
      className={classes.iframe}
      allow="autoplay;encrypted-media;camera;microphone"
      allowFullScreen
    />
  );
}

function WonderCallEmbed() {
  const classes = useStyles();
  const [show, setShow] = useState(false);

  return (
    <NoSsr>
      <ClickAwayListener onClickAway={() => setShow(false)}>
        <MaterialUITooltip
          open={show}
          arrow
          title={<WonderCallIframe />}
          onClose={() => setShow(false)}
          disableHoverListener
          disableFocusListener
          disableTouchListener
        >
          <Fab
            size="large"
            variant="extended"
            aria-label="WonderCall"
            data-ga="WonderCall"
            className={classes.root}
            target="_blank"
            onClick={() => setShow(show => !show)}
          >
            <ChatIcon />
          </Fab>
        </MaterialUITooltip>
      </ClickAwayListener>
    </NoSsr>
  );
}

export default WonderCallEmbed;
