import { useRouter } from 'next/router';
import ProfilePage from 'components/ProfilePage';
import withData from 'lib/apollo';

function ProfilePageViaSlug() {
  const {
    query: { slug },
  } = useRouter();
  return <ProfilePage slug={slug} />;
}

export default withData(ProfilePageViaSlug);
