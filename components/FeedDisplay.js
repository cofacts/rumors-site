import { useState } from 'react';
import { t, jt } from 'ttag';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  leftIcon: { marginRight: theme.spacing(1) },
  paper: { padding: theme.spacing(2) },
}));

function FeedDisplay({ feedUrl }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick}>
        <RssFeedIcon className={classes.leftIcon} />
        {t`Subscribe to this list`}
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        classes={{
          paper: classes.paper,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {jt`You can follow this list using any RSS reader.`}
        <TextField
          label={t`RSS Feed URL`}
          defaultValue={feedUrl}
          margin="normal"
          variant="outlined"
          InputProps={{ readOnly: true }}
          onFocus={e => e.target.select()}
          fullWidth
        />
        {t`Add to`}{' '}
        <a
          href={`https://feedly.com/i/discover/sources/search/feed/${encodeURIComponent(
            feedUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t`Feedly`}
        </a>
      </Popover>
    </>
  );
}

export default FeedDisplay;
