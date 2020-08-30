import { useState, useCallback, useContext } from 'react';
import { c, t } from 'ttag';
import { Box, Select, MenuItem, InputBase, Tabs, Tab } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import useCurrentUser from 'lib/useCurrentUser';
import Hyperlinks from 'components/Hyperlinks';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import { TypeSelect, ReasonEditor, Submit } from './ReplyForm';
import ReplyFormContext from './ReplyForm/context';
import { nl2br, linkify } from 'lib/text';

import ReferenceInput from './ReplyForm/ReferenceInput';
import ReplySearch from './ReplySearch';
import SearchBar from './ReplySearch/SearchBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    minHeight: 60,
    background: theme.palette.secondary[500],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 ${theme.spacing(1)}px`,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  selectIcon: {
    color: theme.palette.common.white,
  },
  cancel: {
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    color: theme.palette.common.white,
    background: theme.palette.secondary[300],
    borderRadius: 30,
    padding: '5px 16px',
  },
  typeSelect: {
    background: theme.palette.secondary[50],
  },
  searchBarContainer: {
    position: 'fixed',
    backgroundColor: theme.palette.secondary[50],
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '12px 10px',
    '&:focus-within': {
      backgroundColor: theme.palette.secondary[100],
    },
  },
  searchBar: {
    backgroundColor: theme.palette.secondary[100],
    borderRadius: 30,
    '& > input': {
      backgroundColor: theme.palette.secondary[100],
    },
    '&:focus-within': {
      background: theme.palette.common.white,
      '& > input': {
        backgroundColor: theme.palette.common.white,
      },
    },
  },
}));

const CustomSelectInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    border: `1px solid ${theme.palette.secondary[100]}`,
    padding: '5px 12px 7px 12px',
    color: theme.palette.common.white,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
}))(InputBase);

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

const NEW_REPLY_VIEW = 'NEW_REPLY_VIEW';
const EXISTING_REPLY_VIEW = 'EXISTING_REPLY_VIEW';

export default function Mobile({
  onClose,
  article,
  handleSubmit,
  creatingReply,
  relatedArticleReplies,
  handleConnect,
  connectingReply,
  existingReplyIds,
}) {
  const [view, setView] = useState(NEW_REPLY_VIEW);
  const [selectedTab, setSelectedTab] = useState(1);

  const { fields, handlers } = useContext(ReplyFormContext);
  const { replyType, text, reference } = fields;
  const {
    updateReplyType,
    updateText,
    updateReference,
    addSuggestion,
  } = handlers;

  const user = useCurrentUser();

  const handleTabChange = useCallback((e, v) => setSelectedTab(v), []);
  const changeView = e => setView(e.target.value);

  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <div className={classes.header}>
        <button type="button" className={classes.cancel} onClick={onClose}>
          {t`Cancel`}
        </button>
        <Select
          labelId="select-view"
          id="select-view"
          value={view}
          onChange={changeView}
          classes={{ icon: classes.selectIcon }}
          input={<CustomSelectInput />}
        >
          <MenuItem value={NEW_REPLY_VIEW}>{t`Compose a new reply`}</MenuItem>
          <MenuItem
            value={EXISTING_REPLY_VIEW}
          >{t`Use existing replies`}</MenuItem>
        </Select>
        <Submit
          disabled={creatingReply}
          onClick={handleSubmit}
          style={{
            visibility: view === EXISTING_REPLY_VIEW ? 'hidden' : 'visible',
          }}
        />
      </div>
      {view === NEW_REPLY_VIEW && (
        <>
          <Tabs
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            value={selectedTab}
            onChange={handleTabChange}
          >
            <CustomTab label={c('Mobile editor tab').t`Message`} />
            <CustomTab label={c('Mobile editor tab').t`Compose`} />
            {replyType !== 'NOT_ARTICLE' && (
              <CustomTab label={c('Mobile editor tab').t`References`} />
            )}
          </Tabs>
          <Box display="flex" flexDirection="column" flexGrow={1}>
            {selectedTab === 0 && (
              <Box p={3.5}>
                {nl2br(
                  linkify(article.text, {
                    props: {
                      target: '_blank',
                    },
                  })
                )}
                <Hyperlinks hyperlinks={article.hyperlinks} />
              </Box>
            )}
            {selectedTab === 1 && (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  p={2}
                  className={classes.typeSelect}
                >
                  <Box pr={2}>
                    <Avatar user={user} size={30} />
                  </Box>
                  <TypeSelect
                    replyType={replyType}
                    onChange={updateReplyType}
                  />
                </Box>
                <ReasonEditor
                  replyType={replyType}
                  value={text}
                  onChange={updateText}
                  onSuggestionAdd={addSuggestion}
                  relatedArticleReplies={relatedArticleReplies}
                  existingReplyIds={existingReplyIds}
                />
              </>
            )}

            {selectedTab === 2 && (
              <ReferenceInput
                replyType={replyType}
                value={reference}
                onChange={updateReference}
              />
            )}
          </Box>
        </>
      )}
      {view === EXISTING_REPLY_VIEW && (
        <Box px={2} overflow="auto">
          <ReplySearch
            relatedArticleReplies={relatedArticleReplies}
            existingReplyIds={existingReplyIds}
            onConnect={handleConnect}
            disabled={connectingReply}
            actionText={t`Use this reply`}
          />
          <div className={classes.searchBarContainer}>
            <SearchBar className={classes.searchBar} />
          </div>
        </Box>
      )}
    </Box>
  );
}
