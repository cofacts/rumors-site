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

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      margin: '0 30px 20px',
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
          content={t`An exclusive service keeps users from repeating requests and provides immediate information about false messages in the previous queries.`}
        />
        <Item
          image={feature2}
          title="個人查核貢獻"
          content="編輯志工在 Cofacts 網站上，針對不實訊息的努力闢謠與澄清，在這裡都看得到唷！編輯在這裡回了哪些訊息、給過哪些建議，在這裡都看得到，也可以分享的成果給他人。"
          mobileReverse
        />
        <Item
          image={feature3}
          title={t`AI tagging`}
          content="將假訊息依照「議題」自動分類，讓不同專長的闢謠編輯，可以聚焦在自己擅長的領域。新回報訊息究竟是有關交通法規、政治攻防、COVID-19 還是免費貼圖詐騙，就讓 AI 來分辨。"
        />
        <Item
          image={feature4}
          title="工程典範"
          content="2016 年起將 chatbot 導入事實查核領域、並提供 API 介接教學，在此領域激起了典範轉移，專業查核組織開始推出自己的chatbot，也有第三方查詢機器人前來介接 Cofacts 資料。"
          mobileReverse
        />
      </div>
    </section>
  );
};

export default SectionFeatures;
