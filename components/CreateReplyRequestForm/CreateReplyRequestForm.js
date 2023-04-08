import React, { useState, useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import { t } from 'ttag';
import { useMutation } from '@apollo/react-hooks';
import {
  ButtonGroup,
  Button,
  Box,
  Menu,
  MenuItem,
  TextareaAutosize,
  Fab,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import { CardContent } from 'components/Card';
import { PenIcon } from 'components/icons';
import Hint from 'components/NewReplySection/ReplyForm/Hint';
import ReportAbuseMenuItem, {
  useCanReportAbuse,
} from 'components/ActionMenu/ReportAbuseMenuItem';
import useCurrentUser from 'lib/useCurrentUser';
import cx from 'clsx';

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;

const useStyles = makeStyles(theme => ({
  replyButton: {
    [theme.breakpoints.down('xs')]: { display: 'none' },
    marginRight: theme.spacing(1),
    flex: 1,
    borderRadius: 30,
  },
  buttonGroup: {
    flex: 2,
    '& > *': {
      flex: 1,
    },
    '& > *:first-child': {
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
    },
    '& > *:last-child': {
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
    },
  },
  isButtonActive: {
    color: theme.palette.primary[500],
  },
  commentInput: {
    flex: 1,
    display: 'flex',
    borderRadius: 24,
    fontSize: 18,
    border: `1px solid ${theme.palette.secondary[100]}`,
    '& > textarea': {
      flex: 1,
      margin: '8px 0 8px 16px',
      background: 'transparent',
      border: 0,
      outline: 0,
    },
  },
  commentSubmitButton: {
    borderRadius: 18,
    margin: 6,
    width: 'min-content', // Make it wrap
  },
  bottomReplyButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    fontSize: 16,
    borderRadius: 0,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  menu: {
    marginTop: 40,
    marginLeft: 30,
  },
  newReplyFab: {
    position: 'fixed',
    zIndex: theme.zIndex.speedDial,
    right: 20,
    bottom: 20,
    transition: 'opacity .2s ease-in',
    pointerEvents: 'none',
    opacity: 0,
    '&.show': { opacity: 1, pointerEvents: 'auto' },
  },
  newReplyFabIcon: {
    marginRight: 8,
    fontSize: 22,
  },
}));

const CREATE_REPLY_REQUEST = gql`
  mutation CreateReplyRequestFromForm($articleId: String!, $reason: String!) {
    CreateReplyRequest(articleId: $articleId, reason: $reason) {
      id
    }
  }
`;
const MIN_REASON_LENGTH = 80;

const SubmitButton = ({
  articleId,
  text,
  onFinish,
  disabled,
  ...buttonProps
}) => {
  const [createReplyRequest] = useMutation(CREATE_REPLY_REQUEST, {
    refetchQueries: ['LoadArticlePage'],
  });

  const handleSubmit = e => {
    e.preventDefault(); // prevent reload
    if (disabled) return;
    createReplyRequest({ variables: { articleId, reason: text } });
    onFinish();
  };

  return (
    <Button
      disabled={disabled}
      onClick={handleSubmit}
      color="primary"
      variant="contained"
      disableElevation
      {...buttonProps}
    >
      {disabled ? t`Please provide more info` : t`Submit`}
    </Button>
  );
};

const CreateReplyRequestForm = React.memo(
  ({
    articleId,
    articleUserId,
    requestedForReply,
    replyRequest,
    onNewReplyButtonClick,
  }) => {
    const buttonRef = useRef(null);
    const [disabled, setDisabled] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showFloatButton, setShowFloatButton] = useState(false);
    const [isRequestedForReply, setIsRequestedForReply] = useState(false);
    const [text, setText] = useState('');

    const [shareAnchor, setShareAnchor] = useState(null);
    const [moreAnchor, setMoreAnchor] = useState(null);

    const canReportAbuse = useCanReportAbuse();

    useEffect(() => {
      // restore from localStorage if applicable.
      // We don't do this in constructor to avoid server/client render mismatch.
      //
      setText(localStorage.text || text);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      setText(
        replyRequest && replyRequest.length > 0 ? replyRequest[0].reason : text
      );
      setIsRequestedForReply(replyRequest && replyRequest.length > 0);
    }, [replyRequest]);

    useEffect(() => {
      setIsRequestedForReply(requestedForReply);
    }, [requestedForReply]);

    // event scroll listener
    useEffect(() => {
      const observer = new IntersectionObserver(
        entries =>
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setShowFloatButton(false);
            } else {
              setShowFloatButton(true);
            }
          }),
        { threshold: 0.2 }
      );

      const target = buttonRef.current;

      observer.observe(target);
      return () => observer.unobserve(target);
    }, []);

    const handleTextChange = ({ target: { value } }) => {
      setText(value);
      setDisabled(!value || value.length < MIN_REASON_LENGTH);
      // Backup to localStorage
      requestAnimationFrame(() => (localStorage.text = value));
    };

    const handleReasonSubmitted = () => {
      setText('');
      setDisabled(false);
      setShowForm(!showForm);
      requestAnimationFrame(() => (localStorage.text = ''));
    };

    const classes = useStyles();
    const user = useCurrentUser();

    return (
      <>
        <CardContent>
          {showForm && (
            <>
              <Box pl={[0, 7]}>
                <Hint>{t`Did you find anything suspicious about the message after you search Facebook & Google?`}</Hint>
              </Box>
              <Box component="form" display="flex" py={2}>
                <Box pr={2} pt={0.5} display={['none', 'block']}>
                  <Avatar user={user} size={42} />
                </Box>
                <label
                  className={cx(classes.commentInput, {
                    [classes.hasContent]: text.length > 10,
                  })}
                >
                  <TextareaAutosize
                    placeholder={t`Please provide paragraphs you find controversial, or related news, image & video material you have found.`}
                    onChange={handleTextChange}
                    value={text}
                    rows={1}
                  />
                  <SubmitButton
                    className={cx(classes.commentSubmitButton)}
                    articleId={articleId}
                    text={text}
                    disabled={disabled}
                    onFinish={handleReasonSubmitted}
                  />
                </label>
              </Box>
            </>
          )}
          <Box display="flex" alignItems="center" ref={buttonRef}>
            <Button
              className={cx(classes.replyButton)}
              color="primary"
              variant="contained"
              onClick={onNewReplyButtonClick}
              disableElevation
            >
              {t`Reply to this message`}
            </Button>
            <ButtonGroup
              className={classes.buttonGroup}
              aria-label="comment and share"
            >
              <Button
                className={cx({ [classes.isButtonActive]: showForm })}
                onClick={() => setShowForm(!showForm)}
                disableElevation
              >
                {isRequestedForReply === true ? t`Update comment` : t`Comment`}
              </Button>
              <Button
                type="button"
                className={cx({ [classes.isButtonActive]: !!shareAnchor })}
                onClick={e => setShareAnchor(e.currentTarget)}
                disableElevation
              >
                {t`Share`}
              </Button>
              {canReportAbuse && (
                <Button
                  type="button"
                  className={cx({ [classes.isButtonActive]: !!moreAnchor })}
                  onClick={e => setMoreAnchor(e.currentTarget)}
                  disableElevation
                  style={{ flex: 0 }}
                >
                  <MoreVertIcon />
                </Button>
              )}
            </ButtonGroup>
            <Menu
              id="share-article-menu"
              anchorEl={shareAnchor}
              keepMounted
              getContentAnchorEl={null}
              open={!!shareAnchor}
              onClose={() => setShareAnchor(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
                  )
                }
              >
                {t`Facebook`}
              </MenuItem>
            </Menu>
            <Menu
              id="more-article-menu"
              anchorEl={moreAnchor}
              keepMounted
              getContentAnchorEl={null}
              open={!!moreAnchor}
              onClose={() => setMoreAnchor(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <ReportAbuseMenuItem
                itemType="article"
                itemId={articleId}
                userId={articleUserId}
              />
            </Menu>
          </Box>
        </CardContent>
        <Button
          color="primary"
          variant="contained"
          className={cx(classes.bottomReplyButton)}
          onClick={onNewReplyButtonClick}
          fullWidth
          disableElevation
        >
          {t`Reply to this message`}
        </Button>
        {user && (
          <Fab
            color="primary"
            size="medium"
            variant="extended"
            aria-label="Add new reply"
            data-ga="Add new reply FAB"
            className={cx(classes.newReplyFab, showFloatButton && 'show')}
            onClick={onNewReplyButtonClick}
          >
            <PenIcon className={classes.newReplyFabIcon} />
            {t`Reply to this message`}
          </Fab>
        )}
      </>
    );
  }
);

CreateReplyRequestForm.displayName = 'CreateReplyRequestForm';

export default CreateReplyRequestForm;
