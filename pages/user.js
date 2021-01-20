import { useRouter } from 'next/router';
import ProfilePage from 'components/ProfilePage';
import withData from 'lib/apollo';

function ProfilePageViaId() {
  const {
    query: { id },
  } = useRouter();
  return <ProfilePage id={id} />;
}

export default withData(ProfilePageViaId);
