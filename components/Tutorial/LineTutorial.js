import { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import cx from 'clsx';
import { t } from 'ttag';

import Slider from 'components/Slider';

import step1A from './images/line-step-1-1.png';
import step2A from './images/line-step-2-1.png';
import step2B from './images/line-step-2-2.png';
import step3A from './images/line-step-3-1.png';
import step3B from './images/line-step-3-2.png';
import step4A from './images/line-step-4-1.png';
import step5A from './images/line-step-5-1.png';
import step5B from './images/line-step-5-2.png';

import LinePreview from './LinePreview';
import Accordion from './Accordion';

const data = [
  {
    id: 0,
    title: t`Recieved doubtful messages from social platform`,
    content: t`While a lot of instant messages are disseminated among our friends' chatroom, you might feel confused whether the information is fake or not.`,
    images: [step1A],
  },
  {
    id: 1,
    title: t`Share this message to Cofacts`,
    content: t`You are encouraged to share to suspicious message to Cofacts chatbot, Cofacts chatbot would help you submit the misinformation to Cofacts fact-checking platform for receiveing similar fact-check reports.`,
    images: [step2A, step2B],
  },
  {
    id: 3,
    title: t`Submit to Cofacts database & fact-checking platform`,
    content: t`Everyone could review the suspicious messages on Cofacts platform, and discuss the fact-checking process and detail.`,
    images: [step3A, step3B],
  },
  {
    id: 4,
    title: t`Fact checkers would comment fact-checking detail on the platform.`,
    content: t`Every volunteers could login Cofacts platform, and submit their fact-checking reports. Volunteers are asked to provide reference and explanation for the fact-checking.`,
    images: [step4A],
  },
  {
    id: 5,
    title: t`Cofacts chatnot would reply this automatically`,
    content: t`Fact-checking contribution would be seen via Cofacts chatbot for everyone; if you think you could improve the content, you are encouraged to submit a new fact-checking reply.`,
    images: [step5A, step5B],
  },
];

const useDesktopStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    maxWidth: 1024,
    margin: '0 auto',
  },
  linePreview: {
    width: 417,
  },
  accordion: {
    width: 404,
    paddingTop: 6,
  },
}));

export const LineTutorialDesktop = () => {
  const classes = useDesktopStyles();
  const [activeIndex, setActiveIndex] = useState(0);

  const onClickStep = index => {
    setActiveIndex(index);
  };

  return (
    <div className={classes.root}>
      <LinePreview
        className={classes.linePreview}
        images={data[activeIndex].images}
        autoplay
      />
      <Accordion
        className={classes.accordion}
        data={data}
        activeIndex={activeIndex}
        onClick={onClickStep}
      />
    </div>
  );
};

const useMobileStyles = makeStyles(theme => ({
  root: {
    scrollPadding: '12.5%',
  },
  slideWrapper: {
    width: '75%',
    scrollSnapAlign: 'center',

    '&:first-child': {
      marginLeft: '12.5%',
    },

    '&:last-child': {
      paddingRight: '12.5%',
      width: '87.7%',
    },
  },
  slide: {
    padding: '0 2.5%',
  },
  linePreview: {
    pointerEvents: 'none',
    margin: '0 4px 0 7px',
  },
  info: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 1.43,
    letterSpacing: 0.25,
    color: 'white',
    background: theme.palette.secondary[200],
    padding: 13,
  },
  activeTitle: {
    background: theme.palette.primary.main,
  },
  content: {
    height: 100,
    padding: 13,
    background: 'white',

    [theme.breakpoints.down('xs')]: {
      height: 130,
    },
  },
}));
export const LineTutorialMobile = () => {
  const classes = useMobileStyles();
  const [activeIndex, setActiveIndex] = useState(0);

  const onSlideChange = value => {
    setActiveIndex(value);
  };

  return (
    <Slider
      className={classes.root}
      slideWrapperClassName={classes.slideWrapper}
      onSlideChange={onSlideChange}
    >
      {data.map(({ id, title, content, images }, index) => (
        <div key={id} className={classes.slide}>
          <LinePreview
            className={classes.linePreview}
            autoplay={index === activeIndex}
            images={images}
          />
          <div className={classes.info}>
            <div
              className={cx(classes.title, {
                [classes.activeTitle]: index === activeIndex,
              })}
            >
              {title}
            </div>
            <div className={classes.content}>{content}</div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

const LineTutorial = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return isDesktop ? <LineTutorialDesktop /> : <LineTutorialMobile />;
};

export default LineTutorial;
