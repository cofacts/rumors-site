import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { t } from 'ttag';

import SectionTitle from './SectionTitle';
import Card from './Card';

import rss from './images/feature-rss.png';
import line from './images/feature-line.png';
import search from './images/feature-search.png';
import newUI from './images/feature-new-ui.png';
import ai from './images/feature-ai.png';
import community from './images/feature-community.png';
import factCheck from './images/feature-fact-check.png';
import tutorial from './images/feature-tutorial.png';
import feedback from './images/feature-feedback.png';
import stats from './images/feature-stats.png';
import starBg from './images/star-bg.png';
import footer from './images/footer.png';
import arrow from './images/arrow-gray.svg';

const featureData = [
  {
    id: 0,
    image: rss,
    title: t`RSS Reading ability`,
    content: t`Our database has a large quantity of material, so we use a subscription system to help link up to IFTTT, find popular topics, and to link to LINE, telegram, Slack and mail to send reminders that verification is underway.`,
  },
  {
    id: 1,
    image: line,
    title: t`LINE notifications`,
    content: t`Traditional chatbots can only report information that has already been verified,  but now when one tries to check a non-yet verified piece of information, the system can send a notification when the information has been verified.  If a better response has since been provided, the system can also send a notification to ensure that information provided is always the most up-to-date.`,
  },
  {
    id: 2,
    image: search,
    title: t`Users can easily check infromation that has already been asked about`,
    content: t`You can access the list of rumours that have already been checked, and the chatbot can help you organise your own table of information and help produce personalised information`,
  },
  {
    id: 3,
    image: newUI,
    title: t`The UI of the new website`,
    content: t`The site now has gamified features and it is nohow easier to see the contribution of each collaborator. We also now have data visualisation and the tools to see what material has been accessed by journalists and the process of verification for each article.`,
  },
  {
    id: 4,
    image: ai,
    title: t`AI automatic categorisation`,
    content: t`We use machine learning technology to help categorise our data. The technology is capable of correctly labeling messages as being about politics, scams, the environment, energy, amongst others. This helps doctors or journalists quickly find messages relating to their areas of expertise to help with message verification.`,
  },
  {
    id: 5,
    image: community,
    title: t`Community Builder`,
    content: t`We help community organisers to efficiently check up on current work progress, the quantity of messages, the positive reviews under the review mechanism, the list of contributors who helped with the output, and the review of response and user feedback from a particular period.`,
  },
  {
    id: 6,
    image: factCheck,
    title: t`The ecology of fact checking`,
    content: t`We collaborate with all fact checking organizations and help them enter the fact checking community by setting aside their competition and rivalry, and encourage them to work together to help create the largest datasets possible.`,
  },
  {
    id: 7,
    image: tutorial,
    title: t`Teaching tools`,
    content: t`Cofacts helps educators the ability to create their own chatbots with search capabilities. We provide free consultancy and assistance to our international collaborators to help the open source community grow. Thailand has already successfully replicated Cofacts' experience to create their own search chatbot based on Cofacts.`,
  },
  {
    id: 8,
    image: feedback,
    title: t`User Feedback`,
    content: t`We collected user feedback and encourage users to cooperate with us to create a better open source environment in which many can use our resources. In addition, by encouraging  user feedback and collaboration, our collaborators can use this feedback to help improve their user experience.`,
  },
  {
    id: 9,
    image: stats,
    title: t`Data`,
    content: t`Cofacts provides a chart that explains how to link the chatbot to a website as a way to help researchers and journalists to follow important topics and write impactful reports. There have already been many academics from Taiwan and other  countries who have quoted this data, and many have directly accessed material Cofacts' open database.`,
  },
];

const useDesktopFeatureStyles = makeStyles(() => ({
  featuresWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: 1100,
    margin: '0 auto',
  },
  card: {
    width: 'calc(33% - 20px)',
    margin: 10,
  },
}));

const DesktopFeatures = () => {
  const classes = useDesktopFeatureStyles();

  return (
    <div className={classes.featuresWrapper}>
      {featureData.map((data) => (
        <Card
          key={data.id}
          className={classes.card}
          image={data.image}
          title={data.title}
          content={data.content}
        />
      ))}
    </div>
  );
};

const useMobileFeatureStyles = makeStyles(() => ({
  features: {
    position: 'relative',
    maxWidth: 360,
    margin: '0 auto',
  },
  prev: {
    position: 'absolute',
    top: 136,
    left: 24,
    transform: 'rotate(180deg)',
  },
  next: {
    position: 'absolute',
    top: 136,
    right: 24,
  },
}));

const MobileFeatures = () => {
  const classes = useMobileFeatureStyles();
  const [activeId, setActiveId] = useState(0);

  return (
    <div className={classes.features}>
      {activeId !== 0 && (
        <div
          className={classes.prev}
          onClick={() => {
            setActiveId(activeId - 1);
          }}
        >
          <img src={arrow} />
        </div>
      )}
      <Card
        className={classes.card}
        image={featureData[activeId].image}
        title={featureData[activeId].title}
        content={featureData[activeId].content}
      />
      {activeId !== featureData.length - 1 && (
        <div
          className={classes.next}
          onClick={() => {
            setActiveId(activeId + 1);
          }}
        >
          <img src={arrow} />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  originalFeatures: {
    position: 'relative',
    background:
      'linear-gradient(181.63deg, #8D1EAA 2.33%, #6D28AA 57.02%, #3D2E56 99.56%)',
    padding: 'calc(12.5vw + 120px) 20px 400px',

    [theme.breakpoints.down('sm')]: {
      padding: 'calc(12.5vw + 20px) 32px 400px',
    },
  },
  starBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: `url(${starBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: 500,
  },
  title: {
    color: 'white',
    marginBottom: 68,

    [theme.breakpoints.down('sm')]: {
      marginBottom: 32,
    },
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    background: `url(${footer})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    width: '100%',
    height: 824,

    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
  },
}));

const SectionOriginalFeatures = () => {
  const classes = useStyles();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <section className={classes.originalFeatures}>
      <div className={classes.starBg} />
      <SectionTitle className={classes.title}>
        {t`Cofacts original features`}
      </SectionTitle>
      {isDesktop ? <DesktopFeatures /> : <MobileFeatures />}
      <div className={classes.footer} />
    </section>
  );
};

export default SectionOriginalFeatures;
