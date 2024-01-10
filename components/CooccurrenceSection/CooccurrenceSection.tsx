import gql from 'graphql-tag';
import { CooccurrenceSectionDataFragment } from 'typegen/graphql';

export const fragments = {
  CooccurrenceSectionData: gql`
    fragment CooccurrenceSectionData on Cooccurrence {
      createdAt
      articles {
        id
        articleType
        text
      }
    }
  `,
};

type Props = {
  cooccurrences: CooccurrenceSectionDataFragment[];
};

function CooccurrenceSection({ cooccurrences }: Props) {
  return <div>{JSON.stringify(cooccurrences)}</div>;
}

export default CooccurrenceSection;
