import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { makeStyles } from '@material-ui/core/styles';
import { c } from 'ttag';

import AppLayout from 'components/AppLayout';
import { TutorialHeader } from 'components/Tutorial';

import withData from 'lib/apollo';

// const useStyles = makeStyles(theme => ({}));

const TutorialPage = () => {
  // const router = useRouter();
  // const classes = useStyles();

  // const {
  //   query: { tab = 'bust-hoaxes' },
  // } = router;

  return (
    <AppLayout container={false}>
      <Head>
        <title>{c('tutorial').t`how to use`}</title>
      </Head>
      <TutorialHeader />
    </AppLayout>
  );
};

export default withData(TutorialPage);
