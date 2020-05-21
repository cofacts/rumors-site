import { useState, useCallback, useContext } from 'react';
import { t } from 'ttag';
import { Box, Tabs, Tab, Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ReplySearch from 'components/NewReplySection/ReplySearch';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import {
  ReasonEditor,
  ReferenceInput,
  TypeSelect,
  Hint,
  Submit,
} from './ReplyForm';
import ReplyFormContext from './ReplyForm/context';
import useCurrentUser from 'lib/useCurrentUser';
import SearchBar from './ReplySearch/SearchBar';

const CustomTab = withStyles(theme => ({
  root: {
    position: 'relative',
    color: theme.palette.secondary[300],
    '&$selected': {
      color: theme.palette.primary,
      '& $indicator': {
        color: theme.palette.primary,
      },
    },
  },
}))(Tab);

const CustomBadge = withStyles(theme => ({
  badge: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary[300],
    transform: 'scale(1) translate(120%, 0)',
  },
}))(Badge);

const Desktop = ({
  relatedArticleReplies,
  handleConnect,
  creatingReply,
  connectingReply,
  existingReplyIds,
}) => {
  const { fields, handlers } = useContext(ReplyFormContext);
  const { replyType, text, reference } = fields;
  const {
    updateReplyType,
    updateText,
    updateReference,
    addSuggestion,
  } = handlers;

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback((e, v) => setSelectedTab(v), []);
  const currentUser = useCurrentUser();

  return (
    <>
      <Tabs
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        value={selectedTab}
        onChange={handleTabChange}
      >
        <CustomTab label={t`New Reply`} />
        <CustomTab
          label={
            <CustomBadge badgeContent={relatedArticleReplies.length || 1000}>
              {t`Reuse existing reply`}
            </CustomBadge>
          }
        />
      </Tabs>
      
      {selectedTab === 0 && (
        <>
          <Box display="flex" alignItems="center" mb={2}>
            <Box pr={2}>
              <Avatar user={currentUser} size={30} />
            </Box>
            <TypeSelect replyType={replyType} onChange={updateReplyType} />
          </Box>

          <ReasonEditor
            replyType={replyType}
            value={text}
            onChange={updateText}
            onSuggestionAdd={addSuggestion}
          />

          <ReferenceInput
            replyType={replyType}
            value={reference}
            onChange={updateReference}
          />

          <Box display="flex" justifyContent="space-between">
            <Hint>{t`You will gain 1 point by submitting the reply`}</Hint>
            <Submit disabled={creatingReply} />
          </Box>
        </>
      )}
      {selectedTab === 1 && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex={1} component="h3">
              {t`Related messages and replies`}
            </Box>
            <Box flex={1} pl={2}>
              <SearchBar />
            </Box>
          </Box>
          <ReplySearch
            relatedArticleReplies={relatedArticleReplies}
            existingReplyIds={existingReplyIds}
            onConnect={handleConnect}
            disabled={connectingReply}
          />
        </>
      )}
    </>
  );
};

export default Desktop;
