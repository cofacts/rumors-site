import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import getConfig from 'next/config';
import { LICENSE_URL, EDITOR_REFERENCE } from 'constants/urls';
import Facebook from './images/facebook.svg';
import Twitter from './images/twitter.svg';
import Github from './images/github.svg';

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
  },
  content: {
    padding: '0 2rem 1.5rem',
  },
});

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
        <Typography variant="body2" style={{ marginTop: 16 }}>
          登入或註冊即表示您同意<a href={EDITOR_REFERENCE}>使用者條款</a>，以
          Cofacts 社群的名義，將您在本網站輸入的內容以 CC BY-SA 4.0 條款釋出為
          <a href={LICENSE_URL}>開放資料</a>。
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
