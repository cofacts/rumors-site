import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialUITooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    left: 20,
    bottom: 20,
  },
}));

function WonderCallEmbed() {
  const classes = useStyles();
  const [show, setShow] = useState(false);

  return (
    <Fab
      size="large"
      variant="extended"
      aria-label="WonderCall"
      data-ga="WonderCall"
      className={classes.root}
      target="_blank"
    >
      <ChatIcon />
    </Fab>
  );
}

export default WonderCallEmbed;
