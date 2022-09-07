import React from 'react';
import Container from '@material-ui/core/Container';
import {
  SideSection,
  SideSectionHeader,
  SideSectionLinks,
  SideSectionLink,
  SideSectionText,
  SideSectionImage,
} from './SideSection';

export default {
  title: 'SideSection',
  component: 'SideSection',
};

export const SideSectionStructure = () => (
  <Container>
    <SideSection>
      <SideSectionHeader>Side section header</SideSectionHeader>
      <SideSectionLinks>
        <SideSectionLink>
          <SideSectionText>Side section 1</SideSectionText>
        </SideSectionLink>
        <SideSectionLink>
          <SideSectionText>
            Side section 2 Side section 2 Side section 2 Side section 2 Side
            section 2 Side section 2 Side section 2 Side section 2 Side section
            2 Side section 2{' '}
          </SideSectionText>
        </SideSectionLink>
        <SideSectionLink>
          <SideSectionText>
            Side section 3 Side section 3 Side section 3 Side section 3 Side
            section 3 Side section 3 Side section 3 Side section 3 Side section
            3 Side section 3 Side section 3 Side section 3 Side section 3 Side
            section 3 Side section 3 Side section 3 Side section 3{' '}
          </SideSectionText>
        </SideSectionLink>
        <SideSectionLink>
          <SideSectionImage src="https://placekitten.com/300/200" />
        </SideSectionLink>
        <SideSectionLink>
          <SideSectionImage src="https://placekitten.com/200/500" />
        </SideSectionLink>
      </SideSectionLinks>
    </SideSection>
  </Container>
);
