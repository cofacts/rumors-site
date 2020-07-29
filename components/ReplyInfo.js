import gql from 'graphql-tag';
import { t, ngettext, msgid } from 'ttag';
import Link from 'next/link';
import isValid from 'date-fns/isValid';
import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import Tooltip from './Tooltip';
import Infos from './Infos';

export default function ReplyInfo({ reply, articleReplyCreatedAt }) {
  const createdAt = articleReplyCreatedAt
    ? new Date(articleReplyCreatedAt)
    : new Date();
  const { articleReplies, user } = reply;
  const referenceCount = articleReplies?.length;
  const timeAgoStr = formatDistanceToNow(createdAt);

  return (
    <Infos>
      {isValid(createdAt) && (
        <Tooltip title={format(createdAt)} arrow>
          <>
            <Link href="/reply/[id]" as={`/reply/${reply.id}`}>
              <a>{t`replied ${timeAgoStr} ago`}</a>
            </Link>
          </>
        </Tooltip>
      )}

      {user?.name && t`originally written by ${user.name}`}

      {referenceCount > 0 &&
        ngettext(
          msgid`${referenceCount} reference`,
          `${referenceCount} references`,
          referenceCount
        )}
    </Infos>
  );
}

ReplyInfo.fragments = {
  replyInfo: gql`
    fragment ReplyInfo on Reply {
      id
      createdAt
      user {
        id
        name
      }
    }
  `,
};
