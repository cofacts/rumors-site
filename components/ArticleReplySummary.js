import React from 'react';
import { t, jt } from 'ttag';
import gql from 'graphql-tag';
import ProfileLink from 'components/ProfileLink';
import cx from 'clsx';
import { TYPE_NAME } from 'constants/replyType';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  replyType: {
    fontWeight: 700,
    color: ({ replyType }) => {
      switch (replyType) {
        case 'OPINIONATED':
          return theme.palette.common.blue1;
        case 'NOT_RUMOR':
          return theme.palette.common.green1;
        case 'RUMOR':
          return theme.palette.common.red1;
        default:
          return theme.palette.common.black;
      }
    },

    '& > a': { textDecoration: 'none' },
    '& > a:hover': { textDecoration: 'underline' },
  },
}));

function ArticleReplySummary({ articleReply, className, ...props }) {
  const { replyType, user } = articleReply;

  const classes = useStyles({ replyType });

  const authorElem = (
    <ProfileLink key="editor" user={user} hasTooltip>
      <span>{user?.name || t`Someone`}</span>
    </ProfileLink>
  );

  return (
    <div className={cx(classes.replyType, className)} {...props}>
      {jt`${authorElem} mark this message ${TYPE_NAME[replyType]}`}
    </div>
  );
}

ArticleReplySummary.fragments = {
  ArticleReplySummaryData: gql`
    fragment ArticleReplySummaryData on ArticleReply {
      replyType
      user {
        name
        ...ProfileLinkUserData
      }
    }
  `,
};

export default ArticleReplySummary;
