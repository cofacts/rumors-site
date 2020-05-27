import React, { useState } from 'react';

const ReplySearchContext = React.createContext();

export const FILTERS = {
  ALL_MESSAGES: 'ALL_MESSAGES',
  MY_MESSAGES: 'MY_MESSAGES',
  ALL_REPLIES: 'ALL_REPLIES',
  MY_REPLIES: 'MY_REPLIES',
};

// eslint-disable-next-line react/display-name
export const withReplySearchContext = Component => props => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL_MESSAGES);

  return (
    <ReplySearchContext.Provider
      value={{ search, setSearch, filter, setFilter }}
    >
      <Component {...props} />
    </ReplySearchContext.Provider>
  );
};

export default ReplySearchContext;
