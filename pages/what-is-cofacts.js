import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';
import { c } from 'ttag';

import AppLayout from 'components/AppLayout';
import { TutorialHeader } from 'components/Tutorial';

import withData from 'lib/apollo';

const useStyles = makeStyles(theme => ({}));

const TutorialPage = () => {
  const classes = useStyles();

  return (
    <AppLayout container={false}>
      <Head>
        <title>{c('tutorial').t`what is cofacts`}</title>
      </Head>
      <TutorialHeader />
    </AppLayout>
  );
};

export default withData(TutorialPage);
