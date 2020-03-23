import React from 'react';
import { t } from 'ttag';
import {
  EDITOR_FACEBOOK_GROUP,
  PROJECT_HACKFOLDR,
  CONTACT_EMAIL,
} from 'constants/urls';
import NavLink from 'components/NavLink';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles(theme => ({
  first: {
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.secondary.main,
    '& h3': {
      color: theme.palette.secondary[300],
    },
  },
  container: {
    width: 800,
    color: '#FFFFFF',
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
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
    lineHeight: '28px',
    fontSize: 20,
    fontWeight: 500,
  },
  linkActive: {
    color: theme.palette.primary[500],
  },
  icon: {
    marginRight: 8,
  },
}))(({ classes, icon, ...rest }) => (
  <div className={classes.linkWrapper}>
    {icon && React.createElement(icon, { className: classes.icon })}
    <NavLink
      className={classes.link}
      activeClassName={classes.linkActive}
      {...rest}
    />
  </div>
));

export default function AppFooter() {
  const classes = useStyles();
  return (
    <footer>
      <div className={classes.first}>
        <div className={classes.container}>
          <div className={classes.column}>
            <h3>{t`Fact Check`}</h3>
            <CustomLink href="/articles">{t`Collected Messages`}</CustomLink>
            <CustomLink href="/replies">{t`Replies`}</CustomLink>
            <CustomLink external href={EDITOR_FACEBOOK_GROUP}>
              {t`Editor forum`}
            </CustomLink>
          </div>
          <div className={classes.column}>
            <h3>{t`About`}</h3>
            <CustomLink external href={PROJECT_HACKFOLDR}>
              {t`About`}
            </CustomLink>
          </div>
          <div className={classes.column}>
            <h3>{t`Contact Us`}</h3>
            <CustomLink
              external
              href={`mailto:${CONTACT_EMAIL}`}
              icon={MailIcon}
            >
              {t`Contact Us`}
            </CustomLink>
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
    </footer>
  );
}
