import React from 'react';
import { t } from 'ttag';
import { Box, SvgIcon, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';

import { TYPE_NAME, TYPE_DESC } from 'constants/replyType';
import ExpandableText from './ExpandableText';
import { linkify, nl2br } from 'lib/text';
import Link from 'next/link';
import PlainList from 'components/PlainList';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    margin: '6px 0',
    border: `1px solid ${theme.palette.secondary[100]}`,
    borderRadius: 8,
  },
  body: {
    padding: 24,
  },
  link: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    borderBottomLeftRadius: 8,
    textDecoration: 'none',
    color: theme.palette.secondary[300],
    [theme.breakpoints.up('md')]: {
      borderLeft: `1px solid ${theme.palette.secondary[100]}`,
      borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    },
  },
  blockquote: {
    fontSize: 13,
    color: theme.palette.secondary[200],
    borderLeft: `2px solid ${theme.palette.secondary[200]}`,
    paddingLeft: 8,
    marginLeft: 0,
  },
  title: {
    marginBottom: '.5rem',
  },
  submit: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    color: theme.palette.common.white,
    width: '100%',
    padding: 12,
  },
}));

const OpenLinkIcon = props => (
  <SvgIcon {...props} viewBox="0 0 16 16">
    <path d="M14 12H6C5.44792 12 4.97656 11.8047 4.58594 11.4141C4.19531 11.0234 4 10.5521 4 10V2C4 1.44792 4.19531 0.976563 4.58594 0.585938C4.97656 0.195312 5.44792 0 6 0H14C14.5521 0 15.0234 0.195312 15.4141 0.585938C15.8047 0.976563 16 1.44792 16 2V10C16 10.5521 15.8047 11.0234 15.4141 11.4141C15.0234 11.8047 14.5521 12 14 12ZM14 3C14 2.71875 13.9036 2.48177 13.7109 2.28906C13.5182 2.09635 13.2813 2 13 2H7C6.71875 2 6.48177 2.09635 6.28906 2.28906C6.09635 2.48177 6 2.71615 6 2.99219C6 3.26823 6.09635 3.50521 6.28906 3.70313C6.48177 3.90104 6.71875 4 7 4H10.625L6.26562 8.35938C6.07812 8.54688 5.98438 8.77344 5.98438 9.03906C5.98438 9.30469 6.07812 9.53125 6.26562 9.71875C6.45313 9.90625 6.67969 10 6.94531 10C7.21094 10 7.4375 9.90625 7.625 9.71875L12 5.34375V9C12 9.28125 12.099 9.51823 12.2969 9.71094C12.4948 9.90365 12.7318 10 13.0078 10C13.2839 10 13.5182 9.90365 13.7109 9.71094C13.9036 9.51823 14 9.28125 14 9V3ZM13 15.0078C13 15.2839 12.9036 15.5182 12.7109 15.7109C12.5182 15.9036 12.2812 16 12 16H2C1.44792 16 0.976563 15.8047 0.585938 15.4141C0.195312 15.0234 0 14.5521 0 14V4C0 3.71875 0.0963542 3.48177 0.289062 3.28906C0.481771 3.09635 0.716146 3 0.992188 3C1.26823 3 1.50521 3.09635 1.70313 3.28906C1.90104 3.48177 2 3.71875 2 4V13C2 13.2813 2.09635 13.5182 2.28906 13.7109C2.48177 13.9036 2.71875 14 3 14H12C12.2708 14 12.5052 14.099 12.7031 14.2969C12.901 14.4948 13 14.7318 13 15.0078Z" />
  </SvgIcon>
);

// user.id is not used in this component, but needed by ReplySearch
const RelatedArticleReplyData = gql`
  fragment RelatedArticleReplyData on ArticleReply {
    articleId
    replyId
    user {
      id
    }
    reply {
      id
      createdAt
      type
      text
    }
    article {
      id
      text
    }
  }
`;

/**
 * @param {object} props.article - {id, text} of the article text
 * @param {object} props.reply - {id, type, createdAt, text} of the reply
 * @param {function} props.onConnect - (replyId) => undefined
 * @param {boolean} props.disabled - if we should disable the connect button
 */
function RelatedReplyItem({ article, reply, onConnect, disabled, actionText }) {
  const classes = useStyles();
  return (
    <li className={classes.root}>
      <Link href="/article/[id]" as={`/article/${article.id}`}>
        <a target="_blank" className={classes.link}>
          <Box
            component="span"
            display={{ xs: 'none', md: 'inline' }}
          >{t`View in new tab`}</Box>
          <Box
            component={OpenLinkIcon}
            display={{ xs: 'inline', md: 'none' }}
          />
        </a>
      </Link>
      <div className={classes.body}>
        <header>
          {t`Message below was considered`}{' '}
          <strong title={TYPE_DESC[reply.type]}>{TYPE_NAME[reply.type]}</strong>
        </header>
        <section>
          <h3 className={classes.title}>{t`Related article`}</h3>
          <blockquote className={classes.blockquote}>
            <ExpandableText wordCount={40}>
              {/*
                Don't need nl2br here, because the user just need a glimpse on the content.
                Line breaks won't help the users.
              */}
              {linkify(article.text)}
            </ExpandableText>
          </blockquote>
        </section>
        <section>
          <h3 className={classes.title}>{t`Related reply`}</h3>
          <ExpandableText>{nl2br(linkify(reply.text))}</ExpandableText>
        </section>
      </div>

      <footer>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => onConnect(reply)}
          disabled={disabled}
          classes={{ root: classes.submit }}
        >
          {actionText}
        </Button>
      </footer>
    </li>
  );
}

function RelatedReplies({
  articleId = '',
  relatedArticleReplies = [],
  onConnect,
  disabled = false,
  actionText = '',
}) {
  if (!relatedArticleReplies.length) {
    return <p>目前沒有相關的回應</p>;
  }

  return (
    <PlainList>
      {relatedArticleReplies.map(({ article, reply }) => (
        <RelatedReplyItem
          key={`${article.id}/${reply.id}`}
          targetArticleId={articleId}
          article={article}
          reply={reply}
          onConnect={onConnect}
          disabled={disabled}
          actionText={actionText}
        />
      ))}
    </PlainList>
  );
}

RelatedReplies.fragments = {
  RelatedArticleReplyData,
};

export default RelatedReplies;
