import { makeStyles } from '@material-ui/core/styles';
import { t } from 'ttag';

export const useHighlightStyles = makeStyles(theme => ({
  highlight: {
    color: theme.palette.primary[700],
    backgroundColor: 'transparent',
  },
  reference: {
    '&:before': {
      content: `'(${t`In reference text`}) '`,
      color: theme.palette.secondary[300],
      fontStyle: 'italic',
    },
  },
  hyperlinks: {
    '&:before': {
      content: `'(${t`In linked text`}) '`,
      color: theme.palette.secondary[300],
      fontStyle: 'italic',
    },
  },
}));
