import { useState, forwardRef, memo } from 'react';
import { t } from 'ttag';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ButtonIcon } from './FeedDisplayComponents';

import CopyButton from '../CopyButton';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(3, 3),
  },
  close: {
    position: 'absolute',
    top: `2%`,
    right: `2%`,
  },
  youtube: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    marginTop: 16,
    marginBottom: 16,
    '& .iframe': {
      position: 'absolute',
      top: '0',
    },
  },
  textFieldInput: {
    fontSize: theme.typography.caption.fontSize,
  },
  subscribe: {
    fontSize: theme.typography.h6.fontSize,
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.h5.fontSize,
    },
    borderRadius: 30,
    padding: '3px 30px',
    textAlign: 'center',
    border: 'none',
  },
}));

const SUCCESS = 'SUCCESS';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DialogBody = forwardRef(function DialogBody(props, ref) {
  const { IFTTTAppletUrl, feedUrl, tutorialYoutubeId, platform, close } = props;
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [value, setValue] = useState(0);

  const CustomTab = withStyles(theme => ({
    root: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.h6.fontWeight,
      [theme.breakpoints.up('md')]: {
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
  }))(Tab);

  const CustomCopyButton = withStyles(theme => ({
    root: {
      fontSize: theme.typography.caption.fontSize,
    },
  }))(CopyButton);

  const copySuccess = text => {
    setMessage(text);
    setStatus(SUCCESS);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div ref={ref} className={classes.dialog}>
      <IconButton className={classes.close} onClick={close}>
        <CloseIcon />
      </IconButton>
      <Box px={3}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <CustomTab label="快速訂閱" {...a11yProps(0)} />
          <CustomTab label="進階設定" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {tutorialYoutubeId ? (
          <Box py={1}>
            <div className={classes.youtube}>
              <iframe
                className="iframe"
                width="100%"
                height="100%"
                // https://developers.google.com/youtube/player_parameters
                src={`https://www.youtube.com/embed/${tutorialYoutubeId}?rel=0&modestbranding=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </Box>
        ) : null}
        <Box textAlign="center">
          <Typography variant="h6">{t`訂閱「等你來答」到 ${platform}`}</Typography>
          <Box py={1}>
            <Button
              className={classes.subscribe}
              variant="contained"
              component="a"
              href={IFTTTAppletUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              disableElevation
            >
              {t`快速訂閱等你來答`}
            </Button>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <p>
          {t`IFTTT（If this then
          that）是能把觸發事件（this）與執行動作（that）串在一起的平台。
          您可以設定 IFTTT，將您篩選過後
          Cofacts「訊息列表」、「最新查核」或「等你來答」的新資訊，傳到指定的
          LINE、Slack 或 Telegram 中。`}
        </p>
        <ol>
          <li>
            {t`複製這個列表的 RSS URL`}
            <Box display="flex" borderRadius={4} border="1px solid #ddd">
              <Box
                flexGrow={1}
                display="flex"
                alignItems="center"
                px={1}
                borderRight="1px solid #ddd"
              >
                <TextField
                  defaultValue={feedUrl}
                  InputProps={{
                    className: classes.textFieldInput,
                    readOnly: true,
                    disableUnderline: true,
                  }}
                  onFocus={e => e.target.select()}
                  fullWidth
                />
              </Box>
              <Box display="flex" alignItems="center">
                <CustomCopyButton
                  content={feedUrl}
                  onSuccess={() => copySuccess(t`Copied to clipboard!`)}
                >{t`Copy`}</CustomCopyButton>
              </Box>
            </Box>
          </li>
          <li>
            {t`進到 `}
            <a
              href="https://ifttt.com/create/"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://ifttt.com/create/
            </a>
          </li>
          <li>
            {t`「If this」選擇 RSS Feed，在要填入 Feed URL 的時候貼上剛才複製的
            Feed URL`}
          </li>
          <li>
            {t`「Then that」選擇您要傳送新資訊的平台。IFTTT
            會指導您進行必要的登入與設定。`}
          </li>
        </ol>
      </TabPanel>
      <Snackbar
        onClose={() => setStatus(null)}
        open={status === SUCCESS}
        message={message}
        autoHideDuration={3000}
      />
    </div>
  );
});

function IFTTTItem({
  feedUrl,
  IFTTTAppletUrl,
  children,
  icon,
  tutorialYoutubeId,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ButtonIcon icon={icon} onClick={handleOpen}>
        {children}
      </ButtonIcon>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogBody
          platform={children}
          feedUrl={feedUrl}
          IFTTTAppletUrl={IFTTTAppletUrl}
          tutorialYoutubeId={tutorialYoutubeId}
          close={handleClose}
        />
      </Dialog>
    </>
  );
}

IFTTTItem.displayName = 'IFTTTItem';

export default memo(IFTTTItem);
