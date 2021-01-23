import { t } from 'ttag';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { EDITOR_REFERENCE } from 'constants/urls';
import Hint from './Hint';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'none',
    marginBottom: 12,
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  textarea: {
    flex: 1,
    width: '100%',
    borderRadius: 8,
    border: 'none',
    outline: 'none',
    padding: '14px 17px',
    [theme.breakpoints.up('md')]: {
      flex: 'none', // Disable flex so that user can enlarge textarea by themselves
      minHeight: 144,
      border: `1px solid ${theme.palette.secondary[100]}`,
      '&:focus': {
        border: `1px solid ${theme.palette.primary[500]}`,
      },
      order: 2,
    },
  },
}));

const ReferenceInput = ({ replyType, value, onChange }) => {
  const classes = useStyles();
  return replyType === 'NOT_ARTICLE' ? (
    <Box py={2}>
      查證範圍請參考{' '}
      <a href={EDITOR_REFERENCE} target="_blank" rel="noopener noreferrer">
        《Cofacts 編輯規則》
      </a>
      。
    </Box>
  ) : (
    <Box flex={1} display="flex" flexDirection="column" py={2}>
      <textarea
        required
        className={classes.textarea}
        id="reference"
        placeholder={t`Source URL`}
        onChange={onChange}
        value={value}
        rows={3}
      />
      <Box
        display="flex"
        justifyContent={{ xs: 'center', md: 'space-between' }}
      >
        <label className={classes.label} htmlFor="reference">
          <strong>
            {(() => {
              if (replyType === 'OPINIONATED') {
                return t`Opinion Sources`;
              } else {
                return t`References`;
              }
            })()}
          </strong>
        </label>
        <Hint>{t`Inserting blank lines between reference items can improve readability in LINE.`}</Hint>
      </Box>
    </Box>
  );
};

export default ReferenceInput;
