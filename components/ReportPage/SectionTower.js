import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';
import Box from '@material-ui/core/Box';

import { PROJECT_SOURCE_CODE } from 'constants/urls';

import ActionButton from './ActionButton';

import dropletImg from './images/ecosystem-droplet.svg';
import towerImg from './images/ecosystem-tower.png';

const useStyles = makeStyles(theme => ({
  towerSection: {
    margin: '12.5vw auto 48px',
    padding: '0 32px',
    maxWidth: 1024,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 1.9,
    color: '#615870',

    [theme.breakpoints.up('md')]: {
      fontSize: 18,
      lineHeight: 1.667,
    },
  },
  droplet: {
    position: 'relative', // for z-index over ecosystem wrapper & top offset
    zIndex: 2,
    top: -34,
    width: 100,

    [theme.breakpoints.up('md')]: {
      width: 198,
      top: -68,
    },
  },
  tower: {
    marginTop: -100,
    marginBottom: 12,
    marginLeft: 4, // compensate for "star" edge on the right
    width: 262,

    [theme.breakpoints.up('md')]: {
      marginTop: -200,
      marginLeft: 8,
      width: 434,
    },
  },
  towerButton: {
    color: '#6d28aa',
  },
}));

function SectionTower() {
  const classes = useStyles();

  return (
    <div className={classes.towerSection}>
      <img src={dropletImg} className={classes.droplet} />
      <br />
      <img className={classes.tower} src={towerImg} />
      <p>
        Cofacts
        蒐集到的訊息、編輯志工撰寫的回應、以及訊息熱門程度等統計資料，不只與
        Cofacts 的使用者共享，也以開放資料的形式，回饋給社會。
      </p>
      <p>
        有如香檳塔一般，Cofacts 從社會各方匯聚、承接群眾協作的回報與闢謠，再以
        CC 授權散佈，讓第三方的查詢聊天機器人（如趨勢科技防詐達人、Gogolook
        美玉姨）、調查記者（如報導者、Readr）與研究單位能加以運用，服務更廣大的受眾，也創造更多可能。
      </p>

      <p>
        截至 2021，Cofacts
        是唯一一個同時結合聊天機器人、公開回報且開放回應之開放原始碼系統。任何有志之士均能使用
        Cofacts 的程式碼，架設自己的開放闢謠系統且自行經營社群。
      </p>

      <Box
        display="flex"
        my={4}
        justifyContent="center"
        style={{ gap: 8 }}
        flexWrap="wrap"
      >
        <ActionButton
          className={classes.towerButton}
          href="https://github.com/cofacts/opendata"
          target="_blank"
        >
          {t`Open data`}
        </ActionButton>
        <ActionButton
          className={classes.towerButton}
          href="/analytics"
          target="_blank"
        >
          {t`Analytics`}
        </ActionButton>

        <ActionButton
          className={classes.towerButton}
          href={PROJECT_SOURCE_CODE}
          target="_blank"
        >
          {t`Source Code`}
        </ActionButton>
      </Box>
    </div>
  );
}

export default SectionTower;
