import React from 'react';
import styled from 'styled-components';
import useExchangeRates from '@/hooks/useExchangeRates';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  INR: '₹',
  CNY: '¥',
};

const FinancialList = ({ financialData, currency }) => {
  const exchangeRates = useExchangeRates();
  const convertCurrency = (amount) => amount * (exchangeRates[currency] || 1);
  const currencySymbol = currencySymbols[currency] || currency;

  return (
    <List>
      {Object.keys(financialData).map((category) => (
        <Category key={category}>
          <h3>{category}</h3>
          {Object.keys(financialData[category]).map((subcategory) => (
            <Entry key={subcategory}>
              <span>{subcategory}</span>
              <span>
                {currencySymbol} {convertCurrency(financialData[category][subcategory]).toFixed(2)}
              </span>
            </Entry>
          ))}
        </Category>
      ))}
    </List>
  );
};

const List = styled.div`
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.secondary};
`;

const Category = styled.div`
  margin-bottom: 20px;
`;

const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  span {
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }
`;

export default FinancialList;
