import { useState, useEffect, memo } from 'react';
import { t } from 'ttag';
import getConfig from 'next/config';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';

import { makeStyles } from '@material-ui/core/styles';

import {
  ListItemLink,
  ListItemCopy,
  DividerWithText,
} from './FeedDisplayComponents';
import IFTTTItem from './IFTTTItem';

import mailIcon from './images/mail.svg';
import feedlyIcon from './images/feedly.svg';
import rssIcon from './images/rss.svg';
import lineIcon from './images/line.svg';
import telegramIcon from './images/telegram.svg';
import slackIcon from './images/slack.svg';

import JsonUrl from 'json-url';

const {
  publicRuntimeConfig: {
    PUBLIC_URL,
    PUBLIC_LINE_IFTTT_APPLET_URL,
    PUBLIC_LINE_IFTTT_TUTORIAL_YOUTUBEID,
    PUBLICTELEGRAM_IFTTT_APPLET_URL,
    PUBLIC_TELEGRAM_IFTTT_TUTORIAL_YOUTUBEID,
    PUBLIC_SLACK_IFTTT_APPLET_URL,
    PUBLIC_SLACK_IFTTT_TUTORIAL_YOUTUBEID,
  },
} = getConfig();

const useStyles = makeStyles(theme => ({
  button: {
    background: theme.palette.secondary[100],
    color: theme.palette.secondary[500],
    borderRadius: 30,
    padding: '5px 14px',
  },
  leftIcon: { marginLeft: theme.spacing(1) },
  grid: { padding: '0px 20px', width: 'auto' },
}));

function FeedDisplay({ listQueryVars }) {
  const SUCCESS = 'SUCCESS';
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [feedUrl, setFeedUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

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

  const copySuccess = text => {
    setMessage(text);
    setStatus(SUCCESS);
    handleClose();
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
          <ListItemLink
            email={true}
            href={`https://feedrabbit.com/?url=${encodedFeedUrl}`}
            icon={mailIcon}
            onClick={handleClose}
          >
            <ListItemText
              primary={t`Email`}
              secondary={t`Via Feedrabbit`}
              secondaryTypographyProps={{
                variant: 'caption',
                color: 'textSecondary',
              }}
            ></ListItemText>
          </ListItemLink>
          <ListItemLink
            href={`https://feedly.com/i/discover/sources/search/feed/${encodedFeedUrl}`}
            icon={feedlyIcon}
            onClick={handleClose}
          >
            <ListItemText>{t`Feedly`}</ListItemText>
          </ListItemLink>

          <ListItemCopy
            icon={rssIcon}
            textToCopy={feedUrl}
            onSuccess={() => copySuccess(t`Copied to clipboard!`)}
          >
            {t`Get RSS Feed Link`}
          </ListItemCopy>

          <DividerWithText>{t`Through IFTTT to`}</DividerWithText>

          <Grid
            className={classes.grid}
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <IFTTTItem
              icon={lineIcon}
              IFTTTAppletUrl={PUBLIC_LINE_IFTTT_APPLET_URL}
              feedUrl={feedUrl}
              tutorialYoutubeId={PUBLIC_LINE_IFTTT_TUTORIAL_YOUTUBEID}
            >
              {'Line'}
            </IFTTTItem>
            <IFTTTItem
              icon={telegramIcon}
              IFTTTAppletUrl={PUBLICTELEGRAM_IFTTT_APPLET_URL}
              feedUrl={feedUrl}
              tutorialYoutubeId={PUBLIC_TELEGRAM_IFTTT_TUTORIAL_YOUTUBEID}
            >
              {'Telegram'}
            </IFTTTItem>
            <IFTTTItem
              icon={slackIcon}
              IFTTTAppletUrl={PUBLIC_SLACK_IFTTT_APPLET_URL}
              feedUrl={feedUrl}
              tutorialYoutubeId={PUBLIC_SLACK_IFTTT_TUTORIAL_YOUTUBEID}
            >
              {'Slack'}
            </IFTTTItem>
          </Grid>
        </List>
      </Popover>
      <Snackbar
        onClose={() => setStatus(null)}
        open={status === SUCCESS}
        message={message}
        autoHideDuration={3000}
      />
    </>
  );
}

FeedDisplay.displayName = 'FeedDisplay';

export default memo(FeedDisplay);
