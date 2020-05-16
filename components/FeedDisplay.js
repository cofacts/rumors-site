import { useState } from 'react';
import { t } from 'ttag';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    background: theme.palette.secondary[100],
    color: theme.palette.secondary[500],
    borderRadius: 30,
    padding: '5px 14px',
  },
  leftIcon: { marginLeft: theme.spacing(1) },
}));

function ListItemLink({ href, children }) {
  return (
    <ListItem
      button
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ListItemText>{children}</ListItemText>
    </ListItem>
  );
}

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
      <Button onClick={handleClick} className={classes.button}>
        {t`Subscribe`}
        <RssFeedIcon className={classes.leftIcon} />
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          <ListSubheader>{t`Get update using Email`}</ListSubheader>
          <ListItemLink href={`https://feedrabbit.com/?url=${feedUrl}`}>
            {t`Via Feedrabbit`}
          </ListItemLink>
          <ListItemLink href={`https://blogtrottr.com/?subscribe=${feedUrl}`}>
            {t`Via Blogtrottr`}
          </ListItemLink>
          <ListItemLink href="https://ifttt.com/feed">
            {t`Via IFTTT (also connects to LINE)`}
          </ListItemLink>

          <ListSubheader>{t`Get RSS updates`}</ListSubheader>
          <ListItemLink
            href={`https://feedly.com/i/discover/sources/search/feed/${encodeURIComponent(
              feedUrl
            )}`}
          >
            {t`Via Feedly`}
          </ListItemLink>
          <ListItem>
            <TextField
              label={t`RSS Feed URL for this list`}
              defaultValue={feedUrl}
              margin="normal"
              variant="outlined"
              InputProps={{ readOnly: true }}
              onFocus={e => e.target.select()}
              fullWidth
            />
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default FeedDisplay;
