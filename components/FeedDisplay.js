import { useState, useEffect } from 'react';
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

import JsonUrl from 'json-url';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

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

function FeedDisplay({ listQueryVars }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [feedUrl, setFeedUrl] = useState(null);

  useEffect(() => {
    const generateUrl = async () => {
      const lib = JsonUrl('lzma');
      const queryString = await lib.compress(listQueryVars);
      setFeedUrl(`${PUBLIC_URL}/api/articles/rss2?json=${queryString}`);
    };
    generateUrl();
  }, [listQueryVars]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const encodedFeedUrl = encodeURIComponent(feedUrl);

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
          <ListItemLink href={`https://feedrabbit.com/?url=${encodedFeedUrl}`}>
            {t`Via Feedrabbit`}
          </ListItemLink>
          <ListItemLink
            href={`https://blogtrottr.com/?subscribe=${encodedFeedUrl}`}
          >
            {t`Via Blogtrottr`}
          </ListItemLink>
          <ListItemLink href="https://ifttt.com/feed">
            {t`Via IFTTT (also connects to LINE)`}
          </ListItemLink>

          <ListSubheader>{t`Get RSS updates`}</ListSubheader>
          <ListItemLink
            href={`https://feedly.com/i/discover/sources/search/feed/${encodedFeedUrl}`}
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

FeedDisplay.displayName = 'FeedDisplay';

export default FeedDisplay;
