import { t } from 'ttag';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

function LoginModal({ onClose }) {
  const redirectUrl = location.href.replace(
    new RegExp(`^${location.origin}`),
    ''
  );
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{t`Login / Signup`}</DialogTitle>
      <DialogContent>
        <a
          href={`${process.env.API_URL}/login/facebook?redirect=${redirectUrl}`}
        >
          Facebook
        </a>
        ・
        <a
          href={`${process.env.API_URL}/login/twitter?redirect=${redirectUrl}`}
        >
          Twitter
        </a>
        ・
        <a href={`${process.env.API_URL}/login/github?redirect=${redirectUrl}`}>
          Github
        </a>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
