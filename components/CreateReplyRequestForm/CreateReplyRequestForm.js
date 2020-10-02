import React, { useState, useEffect, useRef } from 'react';
import { t } from 'ttag';
import { useMutation } from '@apollo/react-hooks';
import {
  ButtonGroup,
  Button,
  SvgIcon,
  Box,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import gql from 'graphql-tag';
import Avatar from 'components/AppLayout/Widgets/Avatar';
import { CardContent } from 'components/Card';
import Hint from 'components/NewReplySection/ReplyForm/Hint';
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
  floatButtonContainer: {
    position: 'absolute',
    opacity: 0,
    zIndex: 1000,
    [theme.breakpoints.up('sm')]: {
      right: 13,
      top: 50,
    },
    transition: 'opacity .2s ease-in',
    pointerEvents: 'none',
    '&.show': { opacity: 1, pointerEvents: 'auto' },
  },
  floatButton: {
    [theme.breakpoints.down('sm')]: {
      top: 120,
      right: 5,
      padding: '6px 13px',
    },
    position: 'fixed',
    boxShadow:
      '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px 0px 2px rgba(0, 0, 0, 0.14)',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.common.white,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    borderRadius: 40,
    paddingRight: 10,
  },
  floatButtonIconContainer: {
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    marginRight: 4,
    [theme.breakpoints.up('md')]: {
      marginRight: 22,
      transformOrigin: '50% 50%',
      transform: 'scale(3)',
      border: `1px solid ${theme.palette.primary[500]}`,
      background: theme.palette.common.white,
    },
  },
  floatButtonIcon: {
    fontSize: 14,
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      fontSize: 10,
      color: theme.palette.primary[500],
    },
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

const PenIcon = props => (
  <SvgIcon viewBox="0 0 22 22" {...props}>
    <path d="M15.5812 0L22 6.43177L20.1494 8.25647L13.7435 1.85059L15.5812 0ZM0 21.0682L8.41177 12.6953C8.28235 12.2941 8.37294 11.7894 8.70941 11.4529C9.21412 10.9482 10.0424 10.9482 10.5471 11.4529C11.0518 11.9706 11.0518 12.7859 10.5471 13.2906C10.2106 13.6271 9.70588 13.7176 9.30471 13.5882L0.931764 22L14.6624 17.4059L19.2306 9.17529L12.8376 2.76941L4.59412 7.33765L0 21.0682Z" />
  </SvgIcon>
);

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
  ({ articleId, requestedForReply, onNewReplyButtonClick }) => {
    const buttonRef = useRef(null);
    const [disabled, setDisabled] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showFloatButton, setShowFloatButton] = useState(false);
    const [text, setText] = useState('');

    const [shareAnchor, setShareAnchor] = useState(null);

    useEffect(() => {
      // restore from localStorage if applicable.
      // We don't do this in constructor to avoid server/client render mismatch.
      //
      setText(localStorage.text || text);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                {requestedForReply === true ? t`Update comment` : t`Comment`}
              </Button>
              <Button
                type="button"
                className={cx({ [classes.isButtonActive]: !!shareAnchor })}
                onClick={e => setShareAnchor(e.currentTarget)}
                disableElevation
              >
                {t`Share`}
              </Button>
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

        <div
          className={cx(
            classes.floatButtonContainer,
            showFloatButton && 'show'
          )}
        >
          <button
            type="button"
            className={classes.floatButton}
            onClick={onNewReplyButtonClick}
          >
            <div className={classes.floatButtonIconContainer}>
              <PenIcon className={classes.floatButtonIcon} />
            </div>
            {t`Reply to this message`}
          </button>
        </div>
      </>
    );
  }
);

CreateReplyRequestForm.displayName = 'CreateReplyRequestForm';

export default CreateReplyRequestForm;
