import React, { useState, useEffect } from 'react';

const ReplyFormContext = React.createContext();

const localStorage = typeof window === 'undefined' ? {} : window.localStorage;
const formInitialState = {
  replyType: 'NOT_ARTICLE',
  reference: '',
  text: '',
};

// eslint-disable-next-line react/display-name
export const withReplyFormContext = (Component) => (props) => {
  const [fields, setFields] = useState(formInitialState);

  useEffect(() => {
    // restore from localStorage if applicable.
    // We don't do this in constructor to avoid server/client render mismatch.
    //
    setFields({
      replyType: localStorage.replyType || fields.replyType,
      reference: localStorage.reference || fields.reference,
      text: localStorage.text || fields.text,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => {
    delete localStorage.replyType;
    delete localStorage.reference;
    delete localStorage.text;

    setFields(formInitialState);
  };

  const set = (key, value) => {
    setFields((data) => ({ ...data, [key]: value }));

    // Backup to localStorage
    requestAnimationFrame(() => (localStorage[key] = value));
  };

  const updateReplyType = ({ target: { value } }) => {
    set('replyType', value);
  };

  const updateText = ({ target: { value } }) => {
    set('text', value);
  };

  const updateReference = ({ target: { value } }) => {
    set('reference', value);
  };

  const addSuggestion = (e) => {
    const result = [e.target.value];
    if (fields.text) result.push(fields.text);

    set('text', result.join('\n'));
  };

  return (
    <ReplyFormContext.Provider
      value={{
        fields,
        handlers: {
          set,
          clear,
          updateReference,
          updateReplyType,
          updateText,
          addSuggestion,
        },
      }}
    >
      <Component {...props} />
    </ReplyFormContext.Provider>
  );
};

export default ReplyFormContext;
