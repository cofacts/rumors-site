import { useMemo } from 'react';
import Link from 'next/link';
import { ngettext, msgid } from 'ttag';
import gql from 'graphql-tag';
import { CooccurrenceSectionDataFragment } from 'typegen/graphql';

import Infos, { TimeInfo } from 'components/Infos';
import {
  SideSection,
  SideSectionHeader,
  SideSectionLinks,
  SideSectionLink,
  SideSectionText,
} from 'components/SideSection';
import Thumbnail from 'components/Thumbnail';

export const fragments = {
  CooccurrenceSectionData: gql`
    fragment CooccurrenceSectionData on Cooccurrence {
      createdAt
      articles {
        id
        articleType
        text
        ...ThumbnailArticleData
      }
    }
    ${Thumbnail.fragments.ThumbnailArticleData}
  `,
};

type Props = {
  cooccurrences: CooccurrenceSectionDataFragment[];
};

function CooccurrenceSection({ cooccurrences }: Props) {
  // Group cooccurrences by same articles
  // then sort by count (more first) and then last createdAt (latest first)
  const cooccurrenceEntries = useMemo(() => {
    const entries = new Map<
      string,
      {
        key: string;
        articles: CooccurrenceSectionDataFragment['articles'];
        count: number;
        lastCooccurred: Date;
      }
    >();
    cooccurrences.forEach(cooccurrence => {
      const key = cooccurrence.articles
        .map(article => article.id)
        .sort()
        .join(',');
      const lastCooccurred = new Date(cooccurrence.createdAt);
      const entry = entries.get(key);
      const lastCooccurredInEntry = entry ? entry.lastCooccurred : null;
      entries.set(key, {
        key,
        articles: cooccurrence.articles,
        count: entry ? entry.count + 1 : 1,
        lastCooccurred:
          lastCooccurredInEntry === null ||
          lastCooccurredInEntry < lastCooccurred
            ? lastCooccurred
            : lastCooccurredInEntry,
      });
    });
    return Array.from(entries.values()).sort((a, b) => {
      if (a.count !== b.count) return b.count - a.count;
      if (a.lastCooccurred !== b.lastCooccurred)
        return +b.lastCooccurred - +a.lastCooccurred;
      return 0;
    });
  }, [cooccurrences]);

  if (!cooccurrences.length) return null;

  return (
    <>
      {cooccurrenceEntries.map(entry => (
        <SideSection key={entry.key}>
          <SideSectionHeader>
            {ngettext(
              msgid`Messages sent together`,
              `Sent together ${entry.count} times`,
              entry.count
            )}
          </SideSectionHeader>
          <SideSectionLinks>
            {entry.articles.map(article => (
              <Link
                key={article.id}
                href="/article/[id]"
                as={`/article/${article.id}`}
                passHref
              >
                <SideSectionLink>
                  {article.articleType !== 'TEXT' ? (
                    <Thumbnail article={article} />
                  ) : (
                    <SideSectionText>{article.text}</SideSectionText>
                  )}
                </SideSectionLink>
              </Link>
            ))}
          </SideSectionLinks>
          <Infos style={{ margin: '0 0 16px' }}>
            <TimeInfo time={entry.lastCooccurred} />
          </Infos>
        </SideSection>
      ))}
    </>
  );
}

export default CooccurrenceSection;
