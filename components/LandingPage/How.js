import React from 'react';
import styled from 'styled-components';

const How = () => {
  return (
    <Section>
      <Container>
        <Title>How to Use Loose</Title>
        <StepsContainer>
          <Step>
            <StepIcon src="/signup.png" alt="Sign Up Icon" />
            <StepTitle>1. Sign Up</StepTitle>
            <StepDescription>
              Create your account in just a few seconds. It's free and easy to get started.
            </StepDescription>
          </Step>
          <Step>
            <StepIcon src="/track-finances.png" alt="Track Expenses Icon" />
            <StepTitle>2. Track Your Expenses</StepTitle>
            <StepDescription>
              Connect your bank accounts or manually add transactions to track your spending.
            </StepDescription>
          </Step>
          <Step>
            <StepIcon src="/budget.png" alt="Budget Icon" />
            <StepTitle>3. Set Budgets</StepTitle>
            <StepDescription>
              Create custom budgets for different categories and stay on top of your finances.
            </StepDescription>
          </Step>
          <Step>
            <StepIcon src="/insight.png" alt="Insights Icon" />
            <StepTitle>4. Get Insights</StepTitle>
            <StepDescription>
              Receive personalized insights and recommendations to save more and spend smarter.
            </StepDescription>
          </Step>
        </StepsContainer>
      </Container>
    </Section>
  );
};

export default How;

// Styled Components
const Section = styled.section`
  background-color: #f9f9f9;
  padding: 80px 20px;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0e131f;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Step = styled.div`
  flex: 1;
  max-width: 250px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StepIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0e131f;
  margin-bottom: 10px;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
`;