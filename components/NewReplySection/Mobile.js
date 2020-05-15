import { useState, useCallback, useContext } from 'react';
import { t } from 'ttag';
import { Box, Select, MenuItem, InputBase, Tabs, Tab } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import useCurrentUser from 'lib/useCurrentUser';
import Hyperlinks from 'components/Hyperlinks';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import { TypeSelect, ReasonEditor, Submit } from './ReplyForm';
import ReplyFormContext from './ReplyForm/context';
import { nl2br, linkify } from 'lib/text';

import ReferenceInput from './ReplyForm/ReferenceInput';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    height: 60,
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
      <div className={classes.top}>
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
          <MenuItem value={NEW_REPLY_VIEW}>{t`New Reply`}</MenuItem>
          <MenuItem
            value={EXISTING_REPLY_VIEW}
          >{t`Search Existing Reply`}</MenuItem>
        </Select>
        <Submit disabled={creatingReply} onClick={handleSubmit} />
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
            <CustomTab label={t`Message`} />
            <CustomTab label={t`Editor`} />
            {replyType !== 'NOT_ARTICLE' && <CustomTab label={t`Source`} />}
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
      {view === EXISTING_REPLY_VIEW && 'under construction ...'}
    </Box>
  );
}
