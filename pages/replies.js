import { t } from 'ttag';
import ArticlePageLayout from 'components/ArticlePageLayout';

function ReplyListPage() {
  return (
    <ArticlePageLayout
      title={t`Latest Replies`}
      articleDisplayConfig={{
        isLink: false,
        showLastReply: true,
        showReplyCount: false,
      }}
      defaultOrder="lastRepliedAt"
    />
  );
}

export default ReplyListPage;
