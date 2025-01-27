import { useState } from 'react';
import { t } from 'ttag';
import { Box } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { Card, CardHeader, CardContent } from 'components/Card';
import Hint from 'components/NewReplySection/ReplyForm/Hint';
import VoteButtons from './VoteButtons';

function AIReplySection({
  defaultExpand = false,
  aiReplyText = '',
  aiResponseId,
}) {
  const [expand, setExpand] = useState(defaultExpand);

  return (
    <Card style={{ background: '#fafafa' }}>
      <CardHeader
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomColor: expand ? '#333' : 'transparent',
          paddingBottom: expand ? undefined : 12,
          cursor: 'pointer',
        }}
        onClick={() => setExpand(v => !v)}
      >
        {t`Automated analysis from AI`}
        {expand ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </CardHeader>
      {expand && (
        <CardContent>
          <Hint>
            {t`The following is the AI's preliminary analysis of this message, which we hope will provide you with some ideas before it is fact-checked by a human.`}
          </Hint>
          <div style={{ whiteSpace: 'pre-line', marginTop: 16 }}>
            {aiReplyText}
          </div>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <VoteButtons aiResponseId={aiResponseId} />
          </Box>
        </CardContent>
      )}
    </Card>
  );
}

export default AIReplySection;
