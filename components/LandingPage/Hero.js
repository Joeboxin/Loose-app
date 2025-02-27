import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Hero = ({text} ) => {
  return (
    <Section>
      <Overlay>
        <Container>
          <HeroTextColumn>
            <Header>
              Take control of your finances with 
              <Highlight> Loose</Highlight>
            </Header>
            <SubheaderAndStarsColumn>
              <SubHeader>Your personal finance companion for smarter spending, saving, and investing.</SubHeader>
              <Link href="/auth/signup">
              <CTAButton>Get Started</CTAButton>
              </Link>
            </SubheaderAndStarsColumn>
          </HeroTextColumn>
        </Container>
      </Overlay>
    </Section>
  );
};

const Section = styled.section`
  background-color: #0E131F;
  color: white;
  padding: 100px 20px;
  text-align: center;
`;

const Overlay = styled.div`
  background: rgba(14, 19, 31, 0.9);
  padding: 40px 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Header = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`;

const Highlight = styled.span`
  color: #55D59E;
`;

const SubHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const SubheaderAndStarsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CTAButton = styled.button`
  background-color: #55D59E;
  color: #0E131F;
  border: none;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45b88d;
  }
`;

export default Hero;
