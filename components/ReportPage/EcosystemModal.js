import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { withDarkTheme } from 'lib/theme';

import SectionTitle from './SectionTitle';

import devBtn from './images/ecosystem-devs.png';
import intlBtn from './images/ecosystem-intl.png';
import communityBtn from './images/ecosystem-community.png';
import researchBtn from './images/ecosystem-research.png';

const ECOSYSTEM_CONTENTS = [
  {
    title: '查核社群',
    img: communityBtn,
    body: '實體聚會、自主貢獻、日日產生查核報告，第一線的戰士組織社群。',
    links: [
      {
        href: 'https://www.youtube.com/watch?v=LkwOLicel4A',
        label: '闢謠編輯現身：謠言不可能一下子就解決，要持續走下去',
      },
      {
        href: 'https://www.facebook.com/groups/cofacts/',
        label: 'Cofacts 編輯交流天地 FB',
      },
      { href: 'https://cofacts.kktix.cc/', label: '過往編輯小聚' },
      {
        href:
          'https://docs.google.com/presentation/d/1QCAPtwkxreQ4EUtIWsOgR4c8h4tkRs22Qvv7jBFNrfI/',
        label: '小聚開場投影片',
      },
    ],
  },
  {
    title: '開發者',
    img: devBtn,
    body: '建立事實查核平台、開發聊天機器人，創造科技工具解決問題。',
    links: [
      {
        href: 'https://hackmd.io/@mrorz/r1nfwTrgM',
        label: 'Cofacts 開發者入口與系統架構',
      },
      {
        href: 'https://g0v.hackmd.io/@mrorz/SJ1f6uU5X',
        label: '架設 Cofacts 英文工作坊＠ 2018 零時政府高峰會',
      },
    ],
  },
  {
    title: '國際交流',
    img: intlBtn,
    body: '提供開發教學資源，開源分享，協助開發機器人，國際交流與技術協助。',
    links: [
      {
        href: 'https://www.youtube.com/watch?v=569cj67xN7c',
        label: 'Introduction to Cofacts @ Google News Lab APAC summit 2017',
      },
      {
        href: 'https://www.youtube.com/watch?v=9iS_Fy2iWb0',
        label: 'Cofacts 設計分享 ＠ 泰國朱拉隆功大學, 2019',
      },
      {
        href: 'https://www.youtube.com/watch?v=DgcI0N2HTMA',
        label: 'Cofacts 設計 @ LINE 開發者大會 2020',
      },
      {
        href: 'https://g0v.hackmd.io/@mrorz/SJ1f6uU5X',
        label: '架設 Cofacts 英文工作坊＠ 2018 零時政府高峰會',
      },
      { href: 'https://cofact.org', label: '泰國 Cofact by OpenDream' },
    ],
  },
  {
    title: '研究',
    img: researchBtn,
    body: '開放資料提供調查記者與專業學者進行研究分析，數據分析資料公開。',
    links: [
      { href: 'https://github.com/cofacts', label: 'Cofacts 開放資料集' },
      { href: 'https://cofacts.org/analytics', label: 'Cofacts 使用數據' },
      { href: 'https://api.cofacts.org', label: 'Cofacts API' },
    ],
  },
];

const useModalButtonStyle = makeStyles(theme => ({
  button: {
    position: 'absolute',
    width: '30%',
    margin: 0,
    cursor: 'pointer',
    '& > img': {
      // Use button width to control img size
      width: '100%',
      transition: 'transform .15s ease-out',
    },
    '&:hover > img': {
      transform: 'scale(1.1)',
    },
    '& > figcaption': {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      minWidth: 'fit-content', // Avoid left: 50% wrapping figcaption too early
      textAlign: 'center', // Will be visible if there are multiple lines
      transform: 'translate(-50%, 0)',
      borderRadius: 23,
      background: '#3D2E56',
      padding: '0 16px',
      color: '#fffefa',
      fontSize: 18,
      fontWeight: 700,
      transition: 'transform .15s ease-out',
      [theme.breakpoints.up('md')]: {
        fontSize: 24,
      },
    },
    '&:hover > figcaption': {
      transform: 'translate(-50%, -1em)',
    },
  },
}));

/**
 * Ecosystem component buttons that will open modal when clicked.
 *
 * @param {number} props.contentIdx - index to ECOSYSTEM_CONTENTS
 * @param {number?} props.imgNudge - % to nudge the image to the right. Used to fix images that is not cropped at center.
 */
export function ModalButton({ contentIdx, imgNudge, ...otherProps }) {
  const classes = useModalButtonStyle();
  const { title, img } = ECOSYSTEM_CONTENTS[contentIdx];

  return (
    <figure className={classes.button} {...otherProps}>
      <img
        src={img}
        alt={title}
        style={imgNudge ? { marginLeft: `${imgNudge}%` } : {}}
      />
      <figcaption>{title}</figcaption>
    </figure>
  );
}

const useStyle = makeStyles(theme => ({
  dialog: {
    background: 'rgba(61,46,86,0.85)',
    backdropFilter: 'blur(6px)',
  },
  close: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  dialogContent: {
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gap: '0 20px',
      gridTemplate: `'img title'
                     'img content'`,
      padding: '20px',
    },

    '& > img': {
      width: 178,
      [theme.breakpoints.up('md')]: {
        width: 347,
      },
      gridArea: 'img',
    },
    '& > h4': {
      color: '#ffb500',
      fontWeight: 700,
      fontSize: 18,
      margin: 0,

      [theme.breakpoints.up('md')]: {
        fontSize: 36,
        gridArea: 'title',
        alignSelf: 'end',
        textAlign: 'left',
      },
    },
    '& > article': {
      width: 'max-content',
      maxWidth: '100%', // still need to wrap
      textAlign: 'justify',
      margin: '20px auto',
      [theme.breakpoints.up('md')]: {
        gridArea: 'content',
      },
    },
    '& ul': {
      paddingLeft: '1.5em',
    },
    '& a': {
      fontWeight: 700,
      color: '#fff',
      textDecoration: 'none',
    },
    '& a:hover': {
      textDecoration: 'underline',
    },
  },
}));

function EcosystemModal({ defaultIdx = 0, onClose }) {
  const classes = useStyle();
  // const [contentIdx, setContentIdx] = useState(defaultIdx);
  const [isClosing, setClosing] = useState(false);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const { title, img, body, links } = ECOSYSTEM_CONTENTS[defaultIdx];

  const handleClose = () => {
    // Invoke onClose after animation ended
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <Dialog
      maxWidth="lg"
      fullScreen={isMobile}
      classes={{ paper: classes.dialog }}
      open={!isClosing}
      onClose={handleClose}
    >
      {isMobile && (
        <DialogTitle>
          <SectionTitle>事實查核生態系</SectionTitle>
        </DialogTitle>
      )}

      <DialogContent className={classes.dialogContent}>
        <img src={img} alt={title} />
        <h4>{title}</h4>
        <article>
          <p>{body}</p>
          <ul>
            {links.map(({ href, label }, idx) => (
              <li key={idx}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </article>
      </DialogContent>
      <IconButton className={classes.close} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
}

export default withDarkTheme(EcosystemModal);
