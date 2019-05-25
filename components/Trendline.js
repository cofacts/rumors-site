import React from 'react';

/**
 * @param {string} props.id - String ID of article
 */
function Trendline({ id, ...iframeProps }) {
  return (
    <iframe
      width="200"
      height="50"
      src={`https://datastudio.google.com/embed/reporting/1t6Qx0P_3lsQilD1PPNf0jIfXsJ1Id7uC/page/q0iq?config=%7B%22df1%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${id}%22%7D`}
      {...iframeProps}
      style={{ border: 0, ...(iframeProps.style || {}) }}
    />
  );
}

export default Trendline;
