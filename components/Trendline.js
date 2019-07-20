import React from 'react';

/**
 * @param {string} props.id - String ID of article
 */
function Trendline({ id }) {
  return (
    <a
      className="root"
      href={`https://datastudio.google.com/u/0/reporting/18J8jZYumsoaCPBk9bdRd97GKvi_W5v-r/page/NrUQ?config=%7B%22df7%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${id}%22%7D`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <iframe
        width="200"
        height="50"
        src={`https://datastudio.google.com/embed/reporting/1t6Qx0P_3lsQilD1PPNf0jIfXsJ1Id7uC/page/q0iq?config=%7B%22df1%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${id}%22%7D`}
        style={{ border: 0 }}
      />
      <style jsx>{`
        .root {
          display: block;
          position: relative;
        }
        .root::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      `}</style>
    </a>
  );
}

export default Trendline;
