import { useState, useEffect } from 'react';
import { t } from 'ttag';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

import {
  ListItemLink,
  ListItemCopy,
  DividerWithText,
  CustomTypography,
} from './FeedDisplayComponents';
import IFTTTItem from './IFTTTItem';

import mailIcon from './images/mail.svg';
import feedlyIcon from './images/feedly.svg';
import rssIcon from './images/rss.svg';
import lineIcon from './images/line.svg';
import telegramIcon from './images/telegram.svg';
import slackIcon from './images/slack.svg';

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
  grid: { padding: '0px 20px', width: 'auto' },
}));

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
          <ListItemLink
            email={true}
            href={`https://feedrabbit.com/?url=${encodedFeedUrl}`}
            icon={mailIcon}
          >
            <ListItemText
              primary={t`Email`}
              secondary={
                <CustomTypography
                  // https://stackoverflow.com/questions/41928567/div-cannot-appear-as-a-descendant-of-p
                  component="span"
                  variant="subtitle2"
                  color="textSecondary"
                >
                  {t`Via Feedrabbit`}
                </CustomTypography>
              }
            ></ListItemText>
          </ListItemLink>
          <ListItemLink
            href={`https://feedly.com/i/discover/sources/search/feed/${encodedFeedUrl}`}
            icon={feedlyIcon}
          >
            <ListItemText>{t`Feedly`}</ListItemText>
          </ListItemLink>

          <ListItemCopy icon={rssIcon} textToCopy={feedUrl}>
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
              IFTTTAppletUrl={process.env.LINE_IFTTT_APPLET_URL}
              feedUrl={feedUrl}
              tutorialYoutubeId={process.env.LINE_IFTTT_TUTORIAL_YOUTUBEID}
            >
              {'Line'}
            </IFTTTItem>
            <IFTTTItem
              icon={telegramIcon}
              IFTTTAppletUrl={process.env.TELEGRAM_IFTTT_APPLET_URL}
              feedUrl={feedUrl}
              tutorialYoutubeId={process.env.TELEGRAM_IFTTT_TUTORIAL_YOUTUBEID}
            >
              {'Telegram'}
            </IFTTTItem>
            <IFTTTItem
              icon={slackIcon}
              IFTTTAppletUrl={process.env.SLACK_IFTTT_APPLET_URL}
              feedUrl={feedUrl}
              tutorialYoutubeId={process.env.SLACK_IFTTT_TUTORIAL_YOUTUBEID}
            >
              {'Slack'}
            </IFTTTItem>
          </Grid>
        </List>
      </Popover>
    </>
  );
}

FeedDisplay.displayName = 'FeedDisplay';

export default FeedDisplay;
