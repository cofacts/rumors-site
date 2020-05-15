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
        placeholder="超連結與連結說明文字"
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
            {replyType === 'OPINIONATED'
              ? '請提供與原文「不同觀點」的文章連結，促使讀者接觸不同意見'
              : '資料來源'}
          </strong>
        </label>
        <Hint>{t`Separate sources with newlines to improve line user experience`}</Hint>
      </Box>
    </Box>
  );
};

export default ReferenceInput;
