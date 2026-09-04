import React, { useEffect, useRef } from 'react';
import { t, jt } from 'ttag';
import gql from 'graphql-tag';
import { ProfileTooltip } from 'components/ProfileLink';
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
  hash: {
    marginLeft: theme.spacing(1),
    scrollMargin: `${theme.spacing(15)}px`,
  },
}));

function ArticleReplySummary({ articleReply, className, ...props }) {
  const { replyType, user } = articleReply;

  const anchorRef = useRef();
  const classes = useStyles({ replyType });

  const authorElem = (
    <ProfileTooltip key="editor" user={user}>
      <span>{user?.name || t`Someone`}</span>
    </ProfileTooltip>
  );

  useEffect(() => {
    if (anchorRef.current.hash === location.hash) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className={cx(classes.replyType, className)} {...props}>
      {jt`${authorElem} mark this message ${TYPE_NAME[replyType]}`}
      <a
        ref={anchorRef}
        className={classes.hash}
        href={`#${articleReply.replyId}`}
        onClick={e => e.target.scrollIntoView({ behavior: 'smooth' })}
      >
        #
      </a>
    </div>
  );
}

ArticleReplySummary.fragments = {
  ArticleReplySummaryData: gql`
    fragment ArticleReplySummaryData on ArticleReply {
      replyType
      user {
        name
        ...ProfileTooltipUserData
      }
    }
    ${ProfileTooltip.fragments.ProfileTooltipUserData}
  `,
};

export default ArticleReplySummary;
