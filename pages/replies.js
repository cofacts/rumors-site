import ArticlePageLayout from 'components/ArticlePageLayout';

function ReplyListPage() {
  return (
    <ArticlePageLayout
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
