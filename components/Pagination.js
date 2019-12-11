import React from 'react';
import Link from 'next/link';
import { t } from 'ttag';

export default function Pagination({
  query = {}, // URL params
  pageInfo = {},
  edges = [],
}) {
  const { firstCursor, lastCursor } = pageInfo;
  if (!firstCursor || !lastCursor) {
    return null;
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
          <a>{t`Prev`}</a>
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
          <a>{t`Next`}</a>
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
