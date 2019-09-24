import { useState, useCallback } from 'react';
import { t } from 'ttag';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';

import useCurrentUser from 'lib/useCurrentUser';
import ReplyForm from './ReplyForm';

function NewReplySection({ onSubmit }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const currentUser = useCurrentUser();

  const handleTabChange = useCallback((e, v) => setSelectedTab(v), []);
  const handleSubmit = useCallback(() => {
    onSubmit(); // Notify upper component of submission
  }, [onSubmit]);

  if (!currentUser) {
    return <p>{t`Please login first.`}</p>;
  }

  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label={t`New Reply`} />
        <Tab
          label={
            <Badge color="secondary" badgeContent={4}>
              {t`Reuse existing reply`}
            </Badge>
          }
        />
        <Tab label={t`Search`} />
      </Tabs>
      {selectedTab === 0 && <ReplyForm onSubmit={handleSubmit} />}
    </>
  );
}

export default NewReplySection;
