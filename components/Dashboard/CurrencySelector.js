import React from 'react';
import styled from 'styled-components';
import useExchangeRates from '@/hooks/useExchangeRates';

const CurrencySelector = ({ currency, setCurrency }) => {
  const exchangeRates = useExchangeRates();

  return (
    <Wrapper>
      <label>Currency:</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        {Object.keys(exchangeRates).map((cur) => (
          <option key={cur} value={cur}>{cur}</option>
        ))}
      </select>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 10px 10px 0px 10px;
  label {
    padding: 8px;
    
    color: ${({ theme }) => theme.text};
  }
  select {
    padding: 5px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

export default CurrencySelector;
