import { useMemo } from 'react';
import Link from 'next/link';
import { ngettext, msgid, t } from 'ttag';
import gql from 'graphql-tag';
import { CooccurrenceSectionDataFragment } from 'typegen/graphql';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles(theme => ({
  timeInfo: {
    margin: '8px 0 0',
    [theme.breakpoints.up('md')]: {
      margin: '0 0 16px',
    },
  },
}));

type Props = {
  /** Ignore the current article */
  currentArticleId: string;
  cooccurrences: CooccurrenceSectionDataFragment[];
};

function CooccurrenceSection({ currentArticleId, cooccurrences }: Props) {
  const classes = useStyles();
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
        articles: cooccurrence.articles.filter(
          ({ id }) => id !== currentArticleId
        ),
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
      return +b.lastCooccurred - +a.lastCooccurred;
    });
  }, [cooccurrences, currentArticleId]);

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
          <Infos className={classes.timeInfo}>
            <TimeInfo time={entry.lastCooccurred}>
              {time => t`Last reported at ${time}`}
            </TimeInfo>
          </Infos>
        </SideSection>
      ))}
    </>
  );
}

export default CooccurrenceSection;
