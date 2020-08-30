import { gql } from '@apollo/client';
import { t, ngettext, msgid } from 'ttag';
import Link from 'next/link';
import Infos, { TimeInfo } from './Infos';

export default function ReplyInfo({ reply, articleReplyCreatedAt }) {
  const createdAt = articleReplyCreatedAt
    ? new Date(articleReplyCreatedAt)
    : new Date();
  const { articleReplies, user } = reply;
  const referenceCount = articleReplies?.length;

  return (
    <Infos>
      <TimeInfo time={createdAt}>
        {timeAgoStr => (
          <Link href="/reply/[id]" as={`/reply/${reply.id}`}>
            <a>{t`replied ${timeAgoStr} ago`}</a>
          </Link>
        )}
      </TimeInfo>

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
