import React, { useRef, useEffect } from 'react';
import { Button } from '@material-ui/core';
import ClipboardJS from 'clipboard';
import { t } from 'ttag';

const CopyButton = React.memo(({ content = '', onClick = () => {} }) => {
  const copyBtnRef = useRef(null);

  useEffect(() => {
    const clipboard = new ClipboardJS(copyBtnRef.current, {
      text: () => content,
    });
    clipboard.on('success', () => onClick());
    return () => clipboard.destroy();
  }, [copyBtnRef.current, content, onClick]);

  return <Button ref={copyBtnRef}>{t`Copy`}</Button>;
});

CopyButton.displayName = 'CopyButton';

export default CopyButton;
