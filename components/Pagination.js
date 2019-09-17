import React from 'react';
import Link from 'next/link';

export default function Pagination({
  query = {}, // URL params
  pageInfo = {},
  edges = [],
}) {
  const { firstCursor, lastCursor } = pageInfo;
  if (!firstCursor || !lastCursor) {
    return <p>Loading...</p>;
  }

  const firstCursorOfPage = edges.length && edges[0] && edges[0].cursor;
  const lastCursorOfPage =
    edges.length && edges[edges.length - 1] && edges[edges.length - 1].cursor;

  return (
    <p>
      {firstCursor && firstCursor !== firstCursorOfPage ? (
        <Link
          href={{
            query: { ...query, before: firstCursorOfPage, after: undefined },
          }}
        >
          <a>Prev</a>
        </Link>
      ) : (
        ''
      )}
      {lastCursor && lastCursor !== lastCursorOfPage ? (
        <Link
          href={{
            query: { ...query, after: lastCursorOfPage, before: undefined },
          }}
        >
          <a>Next</a>
        </Link>
      ) : (
        ''
      )}
      <style jsx>{`
        a {
          padding: 8px;
        }
      `}</style>
    </p>
  );
}
