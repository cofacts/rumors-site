import { t } from 'ttag';
import ArticlePageLayout from 'components/ArticlePageLayout';

function HoaxForYouPage() {
  return (
    <ArticlePageLayout
      title={t`Hoax For You`}
      filters={{
        status: false,
        consider: false,
        category: true,
      }}
    />
  );
}

export default HoaxForYouPage;
