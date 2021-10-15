import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';

import SectionTitle from './SectionTitle';

import feature1 from './images/feature-1.png';
import feature2 from './images/feature-2.png';
import feature3 from './images/feature-3.png';
import feature4 from './images/feature-4.png';

const useItemStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 25px',
    width: '100%',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      margin: '0 30px 20px',
      width: 'unset',
    },
  },
  mobileReverse: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row-reverse',
    },
  },
  image: {
    height: 170,
    flexShrink: 0,

    [theme.breakpoints.down('sm')]: {
      height: 100,
    },

    '& > img': {
      height: '100%',
    },
  },
  textWrapper: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 10,
    },
  },
  mobileTextWrapperReverse: {
    [theme.breakpoints.down('sm')]: {
      marginRight: 10,
      marginLeft: 0,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.45,
    textAlign: 'center',
    color: '#3d2e56',
    margin: '4px 0 18px',

    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      textAlign: 'left',
      margin: '8px 0 8px',
    },
  },
  mobileTitleReverse: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'right',
    },
  },
  content: {
    fontSize: 18,
    lineHeight: 1.67,
    letterSpacing: 1.5,
    textAlign: 'justify',
    color: '#615870',

    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
  },
}));

const Item = ({ image, title, content, mobileReverse }) => {
  const classes = useItemStyles();

  return (
    <div
      className={cx(classes.item, {
        [classes.mobileReverse]: mobileReverse,
      })}
    >
      <div className={classes.image}>
        <img src={image} />
      </div>
      <div
        className={cx(classes.textWrapper, {
          [classes.mobileTextWrapperReverse]: mobileReverse,
        })}
      >
        <div
          className={cx(classes.title, {
            [classes.mobileTitleReverse]: mobileReverse,
          })}
        >
          {title}
        </div>
        <div className={classes.content}>{content}</div>
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  features: {
    padding: '40px 0 72px',
  },
  title: {
    marginBottom: 72,

    [theme.breakpoints.down('sm')]: {
      marginBottom: 50,
    },
  },
  itemWrapper: {
    display: 'flex',
    maxWidth: 1070,
    margin: '0 auto',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      maxWidth: 600,
    },
  },
}));

const SectionFeatures = () => {
  const classes = useStyles();

  return (
    <section className={classes.features}>
      <SectionTitle className={classes.title}>
        {t`Features of Cofacts`}
      </SectionTitle>
      <div className={classes.itemWrapper}>
        <Item
          image={feature1}
          title={t`Notification`}
          content={t`An exclusive service keeps users from repeating requests and provides
          immediate information about false messages in the previous queries.`}
        />
        <Item
          image={feature2}
          title={t`Personal fact-check contribution`}
          content={t`Volunteers would login Cofacts and fact-check the suspicious messages.
          What fact-checkers have replied and commented would be transparent
          and reviewed, the achievement was opened and shareable.`}
          mobileReverse
        />
        <Item
          image={feature3}
          title={t`AI tagging`}
          content={t`Cofacts has categorized misinformation via topics automatically, making
          different expertise focus on their professional fields. Such as COVID-19,
          Vaccine related, propaganda, public policy, or fraud, these could be
          categorized by Artificial Intelligence.`}
        />
        <Item
          image={feature4}
          title="工程典範"
          content={t`Cofacts has provided API connecting instruction, fact-checking system
          since 2016. This achievement leads the combating misinformation ecosystem.
          There were third party chatbots connecting to Cofacts open API and IFCN
          member started to conduct own chatbots.`}
          mobileReverse
        />
      </div>
    </section>
  );
};

export default SectionFeatures;
