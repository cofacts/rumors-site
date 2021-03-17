import { useState } from 'react';
import { t } from 'ttag';
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
    title: t`Fact-check community`,
    img: communityBtn,
    body: t`Involves in physical gatherings, independent contributions, daily audit reports as the frontline organizational community.`,
    links: [
      {
        href: 'https://www.youtube.com/watch?v=LkwOLicel4A',
        label: t`Meet Cofacts editors: the need to keep fighting disinformation`,
      },
      {
        href: 'https://www.facebook.com/groups/cofacts/',
        label: t`Facebook group for Cofacts editors`,
      },
      { href: 'https://cofacts.kktix.cc/', label: t`Past editor's meetups` },
      {
        href:
          'https://docs.google.com/presentation/d/1QCAPtwkxreQ4EUtIWsOgR4c8h4tkRs22Qvv7jBFNrfI/',
        label: t`Editor meetups' opening slides`,
      },
    ],
  },
  {
    title: t`Developers`,
    img: devBtn,
    body: t`Establish the fact-checking platform, develop chatbots, and create technological tools to solve problems.`,
    links: [
      {
        href: 'https://hackmd.io/@mrorz/r1nfwTrgM',
        label: t`Cofacts developer entry page and system diagram`,
      },
      {
        href: 'https://g0v.hackmd.io/@mrorz/SJ1f6uU5X',
        label: t`How to run Cofacts on your laptop workshop @ g0v summit 2018`,
      },
    ],
  },
  {
    title: t`International sharing`,
    img: intlBtn,
    body: t`Provides teaching resources of development, focuses on open source sharing, assists in the development of chatbots, interacts with international communities and helps with technical support.`,
    links: [
      {
        href: 'https://www.youtube.com/watch?v=569cj67xN7c',
        label: t`Introduction to Cofacts @ Google News Lab APAC summit 2017`,
      },
      {
        href: 'https://www.youtube.com/watch?v=9iS_Fy2iWb0',
        label: t`Cofacts Design @ Chulalongkorn University, 2019`,
      },
      {
        href: 'https://www.youtube.com/watch?v=DgcI0N2HTMA',
        label: t`Cofacts Design @ LINE DEVELOPER DAY 2020`,
      },
      {
        href: 'https://g0v.hackmd.io/@mrorz/SJ1f6uU5X',
        label: t`How to run Cofacts on your laptop workshop @ g0v summit 2018`,
      },
      {
        href: 'https://cofact.org',
        label: t`Cofacts clone - Cofact by OpenDream, Thailand`,
      },
    ],
  },
  {
    title: t`Research`,
    img: researchBtn,
    body: t`Provides open data for investigative journalists and scholars to conduct research and analysis, and keep data analysis materials public.`,
    links: [
      { href: 'https://github.com/cofacts', label: t`Cofacts open dataset` },
      {
        href: 'https://cofacts.org/analytics',
        label: t`Cofacts usage analytics`,
      },
      { href: 'https://api.cofacts.org', label: t`Cofacts API` },
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
      padding: '4px 16px',
      color: '#fffefa',
      fontSize: 18,
      fontWeight: 700,
      transition: 'transform .15s ease-out',
      lineHeight: 1.3,
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
          <SectionTitle>{t`Fact-checking ecosystem`}</SectionTitle>
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
