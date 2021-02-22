import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';

import {
  SectionHowToUse,
  SectionInfluence,
  SectionFeatures,
  SectionOriginalFeatures,
  SectionSponsor,
} from 'components/ReportPage';

import bannerImage from 'components/ReportPage/images/banner.png';
import introBg from 'components/ReportPage/images/intro-bg.png';

const useStyles = makeStyles(theme => ({
  banner: {
    width: '100%',
    height: 830,
    background: `url(${bannerImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  intro: {
    background: `url(${introBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    textAlign: 'center',
    padding: '90px 30px 118px',

    [theme.breakpoints.down('sm')]: {
      padding: '32px 32px 78px',
    },

    '& > h4': {
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.45,
      letterSpacing: 5,
      margin: '0 0 24px',

      [theme.breakpoints.down('sm')]: {
        fontSize: 22,
        margin: '0 0 18px',
        letterSpacing: 0,
      },
    },

    '& > p': {
      fontSize: 18,
      lineHeight: 1.67,
      margin: '0 auto 18px',
      maxWidth: 786,
    },
  },
}));

const Report = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>{t`Cofacts social impact report`}</title>
      </Head>
      <div className={classes.root}>
        <section className={classes.banner} />
        <section className={classes.intro}>
          <h4>集結眾人之力，就能創造最大的力量。</h4>
          <p>
            Cofacts
            是最早開發出的事實查核聊天機器人。2016年由工程師發起，在公民科技社群提案，全志工形式成就，每週週會，持續積累能量。
          </p>
          <p>
            目前已經存有4萬筆以上查證過的資訊，透過投入資源與人力，扭轉不實訊息對民主與社會的危害。
          </p>
        </section>
        <SectionHowToUse />
        <SectionInfluence />
        <SectionFeatures />
        <SectionSponsor />
        <SectionOriginalFeatures />
      </div>
    </>
  );
};

export default Report;
