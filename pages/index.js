import Head from 'next/head';
import getConfig from 'next/config';
import { t } from 'ttag';
import { makeStyles } from '@material-ui/core/styles';

import AppLayout from 'components/AppLayout';
import {
  SectionCanDo,
  SectionHow,
  SectionFeature,
} from 'components/LandingPage';

// import qrCodeURL from './../components/LandingPage/images/qr-code.png';
import ogImage from 'components/LandingPage/images/ogimage.png';
import coverImage from 'components/LandingPage/images/cover.png';

import withData from 'lib/apollo';
import { NAVBAR_HEIGHT } from 'constants/size';

const {
  publicRuntimeConfig: { PUBLIC_URL },
} = getConfig();

const useStyles = makeStyles(theme => ({
  sectionCover: {
    width: '100%',
    paddingTop: NAVBAR_HEIGHT,
    background: theme.palette.common.yellow,

    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
    },

    '& > img': {
      width: '100%',
    },
  },
  sectionCanDo: {},
}));
function Home() {
  const title = `${t`Cofacts`} - ${t`Connecting facts and instant messages`}`;
  const description = t`Cofacts is a collaborative system connecting instant messages and fact-check reports or different opinions together. It’s a grass-root effort fighting mis/disinformation in Taiwan.`;

  const classes = useStyles();

  return (
    <AppLayout container={false}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content={process.env.LOCALE} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={PUBLIC_URL} />
        <meta property="og:image" content={`${PUBLIC_URL}${ogImage}`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1271" />
        <meta property="article:author" content="MrOrz" />
        <meta property="article:section" content="Taiwan" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          type="text/css"
          href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css"
        />
        <link
          href="//fonts.googleapis.com/css?family=Lato:400,700"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,700&display=swap&subset=chinese-traditional"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <section className={classes.sectionCover}>
        <img src={coverImage} />
      </section>
      <SectionCanDo />
      <SectionHow />
      <SectionFeature />
    </AppLayout>
  );
}

// Home page should be server-rendered
Home.getInitialProps = () => ({});

export default withData(Home);
