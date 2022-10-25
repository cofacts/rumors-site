import { t, jt } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import getConfig from 'next/config';
import { LICENSE_URL, EDITOR_FACEBOOK_GROUP } from 'constants/urls';
import Link from 'next/link';
import { AUTHOR, LICENSE } from 'lib/terms';
import Facebook from './images/facebook.svg';
import Twitter from './images/twitter.svg';
import Github from './images/github.svg';
import Google from './images/google.svg';
// import Instagram from './images/instagram.svg';

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
  },
  content: {
    padding: '0 2rem 1.5rem',
  },
  terms: {
    color: theme.palette.secondary[200],
    textAlign: 'justify',
    marginTop: theme.spacing(2),
    '& > a': { color: 'inherit' },
  },
}));

const useProviderStyles = makeStyles(theme => ({
  root: {
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
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

const ProviderLink = ({
  provider,
  logo,
  color,
  children,
  redirectPath = '',
}) => {
  const redirectUrl =
    redirectPath ||
    location.href.replace(new RegExp(`^${location.origin}`), '');

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

function LoginModal({ onClose, redirectPath }) {
  const classes = useStyles();

  const termsLink = (
    <Link href="/terms" key="termsLink">
      <a>{t`User Agreement`}</a>
    </Link>
  );
  const licenseLink = (
    <a key="licenseLink" href={LICENSE_URL}>
      {LICENSE}
    </a>
  );
  const authorLink = (
    <a key="authorLink" href={EDITOR_FACEBOOK_GROUP}>
      {AUTHOR}
    </a>
  );

  return (
    <Dialog open maxWidth="xs" onClose={onClose}>
      <DialogTitle className={classes.title}>{t`Login / Signup`}</DialogTitle>
      <DialogContent className={classes.content}>
        <ProviderLink
          provider="facebook"
          logo={Facebook}
          color="#1976D2"
          redirectPath={redirectPath}
        >
          Facebook
        </ProviderLink>
        <ProviderLink
          provider="twitter"
          logo={Twitter}
          color="#03A9F4"
          redirectPath={redirectPath}
        >
          Twitter
        </ProviderLink>
        <ProviderLink
          provider="github"
          logo={Github}
          color="#2B414D"
          redirectPath={redirectPath}
        >
          Github
        </ProviderLink>
        <ProviderLink
          provider="google"
          logo={Google}
          color="#2B414D"
          redirectPath={redirectPath}
        >
          Google
        </ProviderLink>
        {/* <ProviderLink
          provider="instagram"
          logo={Instagram}
          color="#2B414D"
          redirectPath={redirectPath}
        >
          Instagram
        </ProviderLink> */}
        <Typography variant="body2" className={classes.terms}>
          {jt`By logging in you agree to ${termsLink}, and your contribution will be published using ${licenseLink} as ${authorLink}.`}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
