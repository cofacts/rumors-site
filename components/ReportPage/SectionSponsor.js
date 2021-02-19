import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ProgressionWrapper from './ProgressionWrapper';
import cx from 'clsx';

const useHeaderStyles = makeStyles({
  root: {
    color: '#615870',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    gap: '18px',

    '&::before, &::after': {
      content: "''",
      borderTop: '1px solid rgba(97, 88, 112, 0.5)',
      flex: 1,
    },
  },
});

function Header({ className, ...props }) {
  const classes = useHeaderStyles();
  return <h4 className={cx(classes.root, className)} {...props} />;
}

const useStyles = makeStyles(theme => ({
  section: {
    maxWidth: 1168 + 32 * 2,
    padding: '0 32px',
    margin: '0 auto',
  },

  wrapper: {
    zIndex: 1,
    position: 'relative', // for stacking context
    background: theme.palette.background.default,
  },
}));

function SectionSponsor() {
  const classes = useStyles();

  return (
    <ProgressionWrapper className={classes.wrapper}>
      <section className={classes.section}>
        <Header>合作夥伴</Header>
        <Box display="flex">
          <Box flex={1} marginRight={['12px', '96px']}>
            <Header>贊助夥伴</Header>
          </Box>
          <Box flex={1}>
            <Header>天使捐助</Header>
          </Box>
        </Box>
      </section>
    </ProgressionWrapper>
  );
}

export default SectionSponsor;
