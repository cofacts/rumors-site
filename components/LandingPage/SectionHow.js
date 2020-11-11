import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import image1 from './images/section-how-1.png';
import image1Flash from './images/section-how-1-flash.png';
import image2 from './images/section-how-2.png';

const useStyles = makeStyles(theme => ({
  '@keyframes flashing': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  sectionHow: {
    padding: '50px 24px 52px',
    background: theme.palette.primary[200],

    [theme.breakpoints.down('sm')]: {
      padding: '32px 0',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: 1440,
    margin: '0 auto',

    '& > .title': {
      width: '100%',
      paddingLeft: 125,
      fontWeight: 'bold',
      fontSize: 48,
      lineHeight: '70px',
      color: theme.palette.secondary[500],

      [theme.breakpoints.down('md')]: {
        paddingLeft: 50,
      },

      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
        fontWeight: 500,
        fontSize: 34,
        lineHeight: '49px',
        letterSpacing: 0.25,
        textAlign: 'center',
        margin: '8px 0 24px',
      },
    },
  },
  block: {
    width: '50%',

    [theme.breakpoints.down('sm')]: {
      width: '100%',

      '&.rwd-order-1': {
        order: 1,
      },

      '&.rwd-order-2': {
        order: 2,
      },

      '&.rwd-order-3': {
        order: 3,
      },
    },

    '&.text': {
      padding: '0 40px',

      [theme.breakpoints.down('sm')]: {
        padding: '0 30px',
      },
    },

    '& > .title': {
      fontWeight: 'bold',
      fontSize: 48,
      lineHeight: '70px',
      color: theme.palette.secondary[500],
      textAlign: 'center',
      marginBottom: 36,

      [theme.breakpoints.down('sm')]: {
        fontWeight: 500,
        fontSize: 34,
        lineHeight: '49px',
        letterSpacing: 0.25,
        marginTop: 22,
        marginBottom: 24,
      },
    },

    '& > .smTitle': {
      fontWeight: 500,
      fontSize: 34,
      lineHeight: '49px',
      letterSpacing: 0.25,
      color: theme.palette.secondary[500],
      textAlign: 'center',
      marginBottom: 26,

      [theme.breakpoints.down('sm')]: {
        fontWeight: 400,
        fontSize: 24,
        lineHeight: '35px',
        letterSpacing: 'unset',
        marginBottom: 12,
      },
    },
  },
  content: {
    fontSize: 24,
    lineHeight: '35px',
    color: theme.palette.secondary[500],
    maxWidth: 510,
    margin: '0 auto',

    '&:not(:last-child)': {
      marginBottom: 40,
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      lineHeight: '28px',
      letterSpacing: 0.5,
    },
  },
  image: {
    position: 'relative',
    paddingTop: 65,

    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
      margin: '0 auto',

      '&.rwd-order-1': {
        paddingTop: 12,
      },
    },

    '& > img': {
      width: '100%',
    },
  },
  flash: {
    position: 'absolute',
    width: '100%',
    animation: '$flashing 1s infinite',
    animationTimingFunction: 'ease-in-out',
  },
}));

const SectionHow = () => {
  const classes = useStyles();

  return (
    <section className={classes.sectionHow}>
      <div className={classes.container}>
        {/* TODO: translate */}
        <h3 className={cx(classes.block, 'title', 'rwd-order-2')}>
          要怎麼判斷真假？
        </h3>
        <div className={cx(classes.block, classes.image, 'rwd-order-1')}>
          <img className={classes.flash} src={image1Flash} />
          <img src={image1} />
        </div>
        <div className={cx(classes.block, 'text', 'rwd-order-2')}>
          {/* TODO: translate */}
          <div className="smTitle">共同協作，呈現多元觀點</div>
          <div className={classes.content}>
            你所看到的回應，是由其他同樣是使用者的人所寫出來的。Cofacts
            竭盡所能地為你蒐集、呈現最多元的觀點，幫助你在真假當中做出最適當的判斷！
          </div>
          <div className="smTitle">人人都是判斷者</div>
          <div className={classes.content}>
            我們相信，世界上沒有全知全能的判斷者，只有互相貢獻的公民協作，才能更接近真相。在
            Cofacts
            平台上，你可以看見其他人的觀點，除了透過平台資訊幫助自己作出獨立判斷外，更能在
            Cofacts 平台與其他人分享你的想法。
          </div>
        </div>
        <div className={cx(classes.block, 'text', 'rwd-order-3')}>
          <div className="title">你幫我，我幫你</div>
          <div className={classes.content}>
            Cofacts 謠言查證專案 致力於鼓勵所有人都一起成為別人的聊天機器人。
            <br />
            <br />
            只要主動查證謠言訊息，把你查到的回應加入資料庫，就能幫助更多人。
          </div>
        </div>
        <div className={cx(classes.block, classes.image, 'rwd-order-2')}>
          <img src={image2} />
        </div>
      </div>
    </section>
  );
};

export default SectionHow;
