import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Portal from '@material-ui/core/Portal';
import Snackbar from '@material-ui/core/Snackbar';
import copy from 'copy-to-clipboard';
import { t } from 'ttag';

const CopyButton = React.memo(({ content = '' }) => {
  const SUCCESS = 'SUCCESS';
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const onSuccess = text => {
    setMessage(text);
    setTimeout(() => setStatus(SUCCESS), 0);
  };
  const handleClickEvent = () => {
    if (copy(content)) {
      onSuccess(t`Copied to clipboard!`);
    }
  };

  return (
    <>
      <Button onClick={handleClickEvent}>{t`Copy`}</Button>
      {/* Portal Snackbar to document.body */}
      <Portal>
        <Snackbar
          onClose={() => setStatus(null)}
          open={status === SUCCESS}
          message={message}
          autoHideDuration={3000}
        />
      </Portal>
    </>
  );
});

CopyButton.displayName = 'CopyButton';

export default CopyButton;
