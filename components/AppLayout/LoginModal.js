import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import getConfig from 'next/config';
import Facebook from './images/facebook.svg';
import Twitter from './images/twitter.svg';
import Github from './images/github.svg';

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
  },
  content: {
    padding: '1.5rem 3rem',
  },
});

const useProviderStyles = makeStyles(theme => ({
  root: {
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    marginTop: 6,
    background: ({ color }) => color,
    '& > div': {
      position: 'absolute',
      height: 32,
      width: 32,
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 10,
    },
    '& a': {
      flex: '1 1 auto',
      padding: '1rem 5rem',
      color: theme.palette.common.white,
      textTransform: 'uppercase',
      textAlign: 'center',
      textDecoration: 'none',
      letterSpacing: 0.75,
      fontWeight: 500,
    },
  },
}));

const {
  publicRuntimeConfig: { PUBLIC_API_URL },
} = getConfig();

const ProviderLink = ({ provider, logo, color, children }) => {
  const redirectUrl = location.href.replace(
    new RegExp(`^${location.origin}`),
    ''
  );
  const urlFor = provider =>
    `${PUBLIC_API_URL}/login/${provider}?redirect=${redirectUrl}`;
  const classes = useProviderStyles({ color });
  return (
    <div className={classes.root}>
      <div className={classes.logoWrapper}>
        <img src={logo} alt={provider} />
      </div>
      <a href={urlFor(provider)}>{children}</a>
    </div>
  );
};

function LoginModal({ onClose }) {
  const classes = useStyles();

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle className={classes.title}>{t`Login / Signup`}</DialogTitle>
      <DialogContent className={classes.content}>
        <ProviderLink provider="facebook" logo={Facebook} color="#1976D2">
          Facebook
        </ProviderLink>
        <ProviderLink provider="twitter" logo={Twitter} color="#03A9F4">
          Twitter
        </ProviderLink>
        <ProviderLink provider="github" logo={Github} color="#2B414D">
          Github
        </ProviderLink>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
