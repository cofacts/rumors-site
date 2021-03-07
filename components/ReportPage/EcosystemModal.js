import { makeStyles } from '@material-ui/core/styles';
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
        href: 'https://github.com/cofacts',
        label: '闢謠編輯現身：謠言不可能一下子就解決，要持續走下去',
      },
      { href: 'https://github.com/cofacts', label: 'Cofacts 編輯交流天地 FB' },
      { href: 'https://github.com/cofacts', label: '過往編輯小聚' },
      { href: 'https://github.com/cofacts', label: '小聚開場投影片' },
    ],
  },
  {
    title: '開發者',
    img: devBtn,
    body: '建立事實查核平台、開發聊天機器人，創造科技工具解決問題。',
    links: [
      { href: 'https://github.com/cofacts', label: 'Cofacts 系統架構' },
      {
        href: 'https://github.com/cofacts',
        label: '架設 Cofacts 英文工作坊＠ 2018 零時政府高峰會',
      },
    ],
  },
  {
    title: '國際交流',
    img: intlBtn,
    body: '建立事實查核平台、開發聊天機器人，創造科技工具解決問題。',
    links: [
      {
        href: 'https://github.com/cofacts',
        label: 'Introduction to Cofacts @ Google  News Lab APAC summit 2017',
      },
      {
        href: 'https://github.com/cofacts',
        label: 'Cofacts 設計分享＠ 2019 泰國朱拉隆功大學',
      },
      { href: 'https://github.com/cofacts', label: '泰國 Cofact By OpenDream' },
      {
        href: 'https://github.com/cofacts',
        label: '架設 Cofacts 英文工作坊＠ 2018 零時政府高峰會',
      },
    ],
  },
  {
    title: '研究',
    img: researchBtn,
    body: '開放資料提供調查記者與專業學者進行研究分析，數據分析資料公開。',
    links: [
      { href: 'https://github.com/cofacts', label: 'Cofacts 開放資料集' },
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
 * @param {object} props.style - style to apply to the entire button
 */
export function ModalButton({ contentIdx, style, imgNudge }) {
  const classes = useModalButtonStyle();
  return (
    <figure className={classes.button} style={style}>
      <img
        src={ECOSYSTEM_CONTENTS[contentIdx].img}
        alt={ECOSYSTEM_CONTENTS[contentIdx].title}
        style={imgNudge ? { marginLeft: `${imgNudge}%` } : {}}
      />
      <figcaption>{ECOSYSTEM_CONTENTS[contentIdx].title}</figcaption>
    </figure>
  );
}

export default function EcosystemModal() {
  return <div></div>;
}
