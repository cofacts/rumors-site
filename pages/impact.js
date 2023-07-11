import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';

import {
  Banner,
  SectionHowToUse,
  SectionInfluence,
  SectionEcosystem,
  SectionTower,
  SectionFeatures,
  SectionOriginalFeatures,
  SectionSponsor,
} from 'components/ReportPage';

import introBg from 'components/ReportPage/images/intro-bg.png';

const useStyles = makeStyles((theme) => ({
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
      maxWidth: 820,
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
        <Banner />
        <section className={classes.intro}>
          <h4>{t`Individual strengths converge to exert the greatest power`}</h4>
          <p>
            {t`Cofacts is the earliest-developed fact-checking chatbot. The project was launched in 2016 by the engineers, proposed to the civic tech community, and accomplished by a group of volunteers. The team members meet up weekly to maintain the project's dynamic.`}
          </p>
          <p>
            {t`At present, there have been more than 45,000 verified pieces of content in our database. Through investing human and other resources, the project is to reverse harms to democracy and society caused by misinformation.`}
          </p>
        </section>
        <SectionHowToUse />
        <SectionInfluence />
        <SectionEcosystem />
        <SectionTower />
        <SectionFeatures />
        <SectionSponsor />
        <SectionOriginalFeatures />
      </div>
    </>
  );
};

// Make it server-rendered for PUBLIC_GTM_ID
export async function getServerSideProps() {
  return { props: {} };
}

export default Report;
