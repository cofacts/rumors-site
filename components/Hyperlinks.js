import React from 'react';
import { List, Map } from 'immutable';

/**
 *
 * @param {string} error - One of ResolveError https://github.com/cofacts/url-resolver/blob/master/src/typeDefs/ResolveError.graphql
 */
function getErrorText(error) {
  switch (error) {
    case 'NAME_NOT_RESOLVED':
      return 'Domain name cannot be resolved';
    case 'UNSUPPORTED':
    case 'INVALID_URL':
      return 'URL is malformed or not supported';
    case 'NOT_REACHABLE':
      return 'Cannot get data from URL';
    case 'HTTPS_ERROR':
      return 'Target site contains HTTPS error';
    default:
      return 'Unknown error';
  }
}

/**
 * @param {Map} props.hyperlink
 */
function Hyperlink({ hyperlink = Map() }) {
  const title = hyperlink.get('title');
  const summary = (hyperlink.get('summary') || '').slice(0, 200);
  const topImageUrl = hyperlink.get('topImageUrl');
  const error = hyperlink.get('error');

  return (
    <article className="link">
      <h1 title={title}>{title}</h1>
      <a
        className="url"
        href={hyperlink.get('url')}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hyperlink.get('url')}
      </a>
      <div className="preview__container">
        <p className="preview__summary" title={summary}>
          {summary}
        </p>
        {topImageUrl && (
          <figure
            className="preview__img"
            style={{ backgroundImage: `url(${topImageUrl})` }}
          />
        )}
        {error && <p className="error">{getErrorText(error)}</p>}
      </div>

      <style jsx>{`
        .link {
          border: 1px solid rgba(0, 0, 0, 0.2);
          padding: 12px 8px;
          margin: 0 8px 8px 0;
          width: 100%;
          max-width: 450px;
          overflow: hidden;
        }

        .preview__container {
          display: flex;
          border-left: 3px solid rgba(0, 0, 0, 0.2);
          padding-left: 10px;
          padding-right: 15px;
          min-height: 40px;
          justify-content: space-between;
        }

        .preview__img {
          margin: 0;
          max-height: 60px;
          min-width: 60px;
          border-right: 1px solid rgba(0, 0, 0, 0.2);
          background: #ccc center center no-repeat;
          background-size: cover;
          border-radius: 3px;
        }

        .link h1 {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0;
          max-width: inherit;
        }

        .url {
          display: block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
          margin-bottom: 8px;
        }

        .preview__summary {
          font-size: 12px;
          color: #333;
          max-height: 40px;
          overflow: hidden;
          margin: 0;
          display: flex;
          margin-right: 10px;
        }

        .error {
          color: firebrick;
          font-size: 12px;
          font-style: italic;
        }
      `}</style>
    </article>
  );
}

/**
 * @param {List} props.hyperlinks
 */
function Hyperlinks({ hyperlinks = List() }) {
  if (!hyperlinks || hyperlinks.size === 0) return null;

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
          max-width: 100%;
        }
      `}</style>
    </section>
  );
}

export default Hyperlinks;
