import { useState } from 'react';
import { t } from 'ttag';
import { makeStyles, styled } from '@material-ui/core/styles';
import Link from 'next/link';
import Box from '@material-ui/core/Box';

import ProgressionWrapper from './ProgressionWrapper';
import SectionTitle from './SectionTitle';
import ActionButton from './ActionButton';
import EcosystemModal, { ModalButton } from './EcosystemModal';

import starBg from './images/star-bg.svg';
import trinityLinkBg from './images/ecosystem-trinity-link.png';

const StatUnit = styled('span')(({ theme }) => ({
  color: '#ffb500',
  fontSize: 13,
  [theme.breakpoints.up('md')]: {
    fontSize: 35,
  },
}));

const StatName = styled('div')(({ theme }) => ({
  fontWeight: 700,
  fontSize: 13,
  color: '#fffefa',
  [theme.breakpoints.up('md')]: {
    fontSize: 24,
  },
}));

const StatValue = styled('span')(({ theme }) => ({
  color: '#ffb500',
  fontWeight: 300,
  fontSize: 36,
  lineHeight: 1,

  [theme.breakpoints.up('md')]: {
    fontSize: 96,
  },
}));

const useStyles = makeStyles((theme) => ({
  wrapper: {
    color: '#fff',
    background: 'linear-gradient(181.58deg, #8D1EAA 2.25%, #6D28AA 91.21%)',
    position: 'relative', // For pseudo-element background
    padding: '24px 0 calc(12.5vw + 80px)',
    fontSize: 13,
    lineHeight: 1.9,

    [theme.breakpoints.up('md')]: {
      padding: '48px 0 10vw',
      fontSize: 18,
      lineHeight: 1.667,
    },

    '&::before': {
      content: "''",
      position: 'absolute',
      top: '4vw',
      left: '4vw',
      right: '4vw',
      background: `url(${starBg}) no-repeat`,
      backgroundSize: 'contain',
      height: '96vw',

      zIndex: -1,
    },
  },
  shadow: {
    filter: 'drop-shadow(0px 0px 57px #67227E)',
  },
  title: {
    [theme.breakpoints.up('md')]: {
      marginBottom: 48,
    },
  },
  modalButtons: {
    // Wrapper of modal dialog buttons
    position: 'relative',
    padding: '0 12px',
    maxWidth: '100vh',
    margin: '0 auto',
  },
  modalButtonsBg: {
    width: '100%',
    animation: '1.7s alternate ease-in-out infinite $breath',
  },
  '@keyframes breath': {
    from: { opacity: 0.6 },
    to: { opacity: 1 },
  },
  stats: {
    display: 'flex',
    flexFlow: 'row wrap',
    listStyleType: 'none',
    padding: '48px 32px',
    margin: '0 auto',
    width: '100%',
    maxWidth: 1024,
    gap: '24px',
    '& > li': {
      padding: 0,
      margin: 0,
    },
    [theme.breakpoints.up('md')]: {
      gap: '80px',
      padding: '80px 0',
    },
  },
  empowerTitle: {
    margin: '80px 0 16px',
    [theme.breakpoints.up('md')]: {
      margin: '96px 0 42px',
    },
  },
  empowerContent: {
    margin: '1em auto',
    padding: '0 32px',
    maxWidth: 604,
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
}));

function SectionEcosystem() {
  const classes = useStyles();
  const [shownModalIndex, showModalWithIndex] = useState(null);

  return (
    <div className={classes.shadow}>
      <ProgressionWrapper className={classes.wrapper}>
        <SectionTitle className={classes.title}>
          {t`Fact-checking ecosystem`}
        </SectionTitle>

        <div className={classes.modalButtons}>
          <img className={classes.modalButtonsBg} src={trinityLinkBg} />
          <ModalButton
            contentIdx={0}
            style={{
              top: 0,
              left: '35%',
            }}
            imgNudge={4}
            onClick={() => showModalWithIndex(0)}
          />
          <ModalButton
            contentIdx={1}
            style={{ left: '29%', top: '33%', width: '42%' }}
            onClick={() => showModalWithIndex(1)}
          />
          <ModalButton
            contentIdx={2}
            imgNudge={-2}
            style={{ left: '4%', bottom: '6%' }}
            onClick={() => showModalWithIndex(2)}
          />
          <ModalButton
            contentIdx={3}
            style={{ right: '4%', bottom: '6%' }}
            onClick={() => showModalWithIndex(3)}
          />
        </div>

        {shownModalIndex !== null && (
          <EcosystemModal
            defaultIdx={shownModalIndex}
            onClose={() => showModalWithIndex(null)}
          />
        )}

        <Box textAlign="center" maxWidth={1024} px={4} mx="auto">
          <h3>{t`Cofacts`}</h3>
          <p style={{ whiteSpace: 'pre-line' }}>
            {t`Cofacts is our original chatbot for checking messages.
               It is the only open source code and the largest Chinese false information checking platform.
               It encourages volunteers to participate through crowd collaboration and rewards different types of volunteers to motivate their participation.`}
          </p>
        </Box>

        <ul className={classes.stats}>
          <li>
            <StatName>資料收錄</StatName>
            <StatValue>45,600</StatValue>
          </li>
          <li>
            <StatName>完成查核數</StatName>
            <StatValue>45,000</StatValue>
          </li>
          <li>
            <StatName>上線編輯</StatName>
            <StatValue>10</StatValue>
            <StatUnit> 名 / 週</StatUnit>
          </li>
          <li>
            <StatName>新增回應</StatName>
            <StatValue>15,000</StatValue>
            <StatUnit> 篇 / 年</StatUnit>
          </li>
          <li>
            <StatValue style={{ lineHeight: 1.3 }}>每 2 個月</StatValue>
            <StatName>志工實體聚會</StatName>
          </li>
          <li>
            <StatName>網站 PV</StatName>
            <StatValue>10,000,000</StatValue>
            <StatUnit> 次 / 年</StatUnit>
          </li>
          <li>
            <StatName>機器人自動回應</StatName>
            <StatValue>200,000</StatValue>
            <StatUnit> 次 / 年</StatUnit>
          </li>
        </ul>

        <Box textAlign="center">
          <Link href="/" passHref>
            <ActionButton style={{ color: '#ffb500' }} theme="dark">
              前往 Cofacts 真的假的網站
            </ActionButton>
          </Link>
        </Box>

        <SectionTitle className={classes.empowerTitle}>
          事實查核培力
        </SectionTitle>
        <p className={classes.empowerContent}>
          即便是擁有思辨能力、查證能力的個體，遇到 LINE
          上來自不同聊天視窗、的不實訊息，也會覺得重複查找資料回應很吃力、甚至放棄掙扎。
        </p>

        <p className={classes.empowerContent}>
          Cofacts 像是這些人面對假訊息時，共同編纂的一份共筆；Cofacts
          聊天機器人會查詢現有不實訊息的澄清回應、也能讓人提交新的申訴，把需要查證的資訊送進公開資料庫。
        </p>

        <p className={classes.empowerContent}>
          此類資源的共享，讓散佈在各個聊天群組、關心不實訊息影響的公民們，開始有了團結起來抵抗不實訊息的基礎；Cofacts
          也會舉辦查核工作坊，培訓進行新的編輯志工培力，讓大家能齊聚一堂，不用再孤軍奮戰。
        </p>
      </ProgressionWrapper>
    </div>
  );
}

export default SectionEcosystem;
