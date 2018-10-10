import React from 'react';
import { List, Map } from 'immutable';

/**
 *
 * @param {Map} props.hyperlink -
 */
function Hyperlink({ hyperlink = Map() }) {
  const summary = (hyperlink.get('summary') || '').slice(0, 200);
  return (
    <article className="link">
      <h1>{hyperlink.get('title')}</h1>
      <p className="url">{hyperlink.get('url')}</p>
      <p className="summary" title={summary}>
        {summary}
      </p>
      <style jsx>{`
        .link {
          max-width: 240px;
          padding: 16px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          margin: 0 8px 8px 0;
        }

        .link h1 {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        .url {
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
          margin: 8px 0;
        }

        .summary {
          font-size: 12px;
          color: #333;
          max-height: 40px;
          overflow: hidden;
          margin: 0;
        }
      `}</style>
    </article>
  );
}

/**
 * @param {List} props.hyperlinks
 */
function Hyperlinks({ hyperlinks = List() }) {
  if (hyperlinks.size === 0) return null;

  return (
    <section className="links">
      {hyperlinks
        .map((hyperlink, idx) => <Hyperlink key={idx} hyperlink={hyperlink} />)
        .toArray()}
      <style jsx>{`
        .links {
          display: flex;
          flex-flow: row wrap;
          margin: 16px 0 8px;
        }
      `}</style>
    </section>
  );
}

export default Hyperlinks;
