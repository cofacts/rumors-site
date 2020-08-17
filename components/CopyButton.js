import React from 'react';
import Button from '@material-ui/core/Button';
import copy from 'copy-to-clipboard';
import { t } from 'ttag';

const CopyButton = React.memo(({ content = '', onSuccess }) => {
  const handleClickEvent = () => {
    if (copy(content)) {
      if (typeof onSuccess === 'function') onSuccess();
    }
  };

  return (
    <>
      <Button onClick={handleClickEvent}>{t`Copy`}</Button>
    </>
  );
});

CopyButton.displayName = 'CopyButton';

export default CopyButton;
