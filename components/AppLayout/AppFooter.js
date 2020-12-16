import React from 'react';
import { c, t } from 'ttag';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Box, useMediaQuery } from '@material-ui/core';
import { withDarkTheme } from 'lib/theme';
import {
  EDITOR_FACEBOOK_GROUP,
  PROJECT_HACKFOLDR,
  PROJECT_SOURCE_CODE,
  PROJECT_MEDIUM,
  CONTACT_EMAIL,
  LINE_URL,
} from 'constants/urls';
import NavLink from 'components/NavLink';
import GoogleWebsiteTranslator from './GoogleWebsiteTranslator';

import facebookIcon from './images/facebook.svg';
import mailIcon from './images/mail.svg';
import lineIcon from './images/line.svg';

const useStyles = makeStyles(theme => ({
  first: {
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.secondary.main,
    '& h3': {
      color: theme.palette.secondary[300],
      fontSize: 18,
      lineHeight: 1.56,
      letterSpacing: 0.5,
      marginBottom: 27,
    },
  },
  container: {
    width: 800,
    color: theme.palette.text.primary,
    margin: 60,
    display: 'flex',
  },
  second: {
    display: 'flex',
    justifyContent: 'center',
    padding: 28,
    background: theme.palette.secondary[900],
  },
  logo: {
    width: 275,
    height: 'auto',
  },
  column: {
    flex: '1 1',
  },
  linkTextWithIcon: {
    marginLeft: 12,
  },
}));

const CustomLink = withStyles(theme => ({
  linkWrapper: {
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    lineHeight: '28px',
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0.15,

    '&:hover': { color: theme.palette.text.secondary },
  },
  linkActive: {
    color: theme.palette.primary[500],
  },
  icon: {
    marginRight: 20,
  },
}))(({ classes, icon: Icon, ...rest }) => (
  <div className={classes.linkWrapper}>
    {Icon && <Icon className={classes.icon} />}
    <NavLink
      className={classes.link}
      activeClassName={classes.linkActive}
      {...rest}
    />
  </div>
));

function AppFooter() {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:768px)');

  return (
    <Box component="footer" display={['none', 'none', 'block']}>
      <div className={classes.first}>
        <div className={classes.container}>
          <div className={classes.column}>
            <h3>{t`Fact Check`}</h3>
            <CustomLink href="/articles">{t`Messages`}</CustomLink>
            <CustomLink href="/replies">
              {c('App layout').t`Replies`}
            </CustomLink>
            <CustomLink href="/hoax-for-you">
              {c('App layout').t`For You`}
            </CustomLink>
            {/* TODO: add link */}
            <CustomLink href="">{t`Following`}</CustomLink>
          </div>
          <div className={classes.column}>
            <h3>{t`About`}</h3>
            <CustomLink external href="">
              {t`About Cofacts`}
            </CustomLink>
            <CustomLink external href={PROJECT_HACKFOLDR}>
              {t`Introduction`}
            </CustomLink>
            <CustomLink external href={PROJECT_SOURCE_CODE}>
              {t`Source Code`}
            </CustomLink>
            <CustomLink external href={PROJECT_MEDIUM}>
              Medium
            </CustomLink>
          </div>
          <div className={classes.column}>
            <h3>{t`Contact`}</h3>
            <CustomLink
              external
              href={`mailto:${CONTACT_EMAIL}`}
              icon={({ className }) => (
                <img
                  className={className}
                  src={mailIcon}
                  style={{ width: '30px' }}
                />
              )}
            >
              {t`Contact Us`}
            </CustomLink>
            <CustomLink
              external
              href={EDITOR_FACEBOOK_GROUP}
              icon={({ className }) => (
                <img
                  className={className}
                  src={facebookIcon}
                  style={{ width: '30px' }}
                />
              )}
            >
              {t`Facebook forum`}
            </CustomLink>
            <CustomLink
              external
              href={LINE_URL}
              icon={({ className }) => (
                <img
                  className={className}
                  src={lineIcon}
                  style={{ width: '30px' }}
                />
              )}
            >
              Line: @cofacts
            </CustomLink>
            {matches && <GoogleWebsiteTranslator />}
          </div>
        </div>
      </div>
      <div className={classes.second}>
        <a
          href="https://grants.g0v.tw/power/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className={classes.logo}
            src="https://grants.g0v.tw/images/power/poweredby-long-i.svg"
            alt="Powered by g0v"
          />
        </a>
      </div>
    </Box>
  );
}

export default React.memo(withDarkTheme(AppFooter));
