import React from 'react';
import Container from '@material-ui/core/Container';
import {
  SideSection,
  SideSectionHeader,
  SideSectionLinks,
  SideSectionLink,
  SideSectionText,
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
      </SideSectionLinks>
    </SideSection>
  </Container>
);
