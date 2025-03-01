import { useState, useEffect } from 'react';

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

const useExchangeRates = () => {
  const api_key = process.env.NEXT_PUBLIC_API_KEY;
  const [exchangeRates, setExchangeRates] = useState({ USD: 1 });

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${api_key}/latest/USD`);
        const data = await response.json();

        // Filter only the required currencies
        const filteredRates = Object.keys(currencySymbols).reduce((acc, cur) => {
          acc[cur] = data.conversion_rates[cur] || 1;
          return acc;
        }, {});

        setExchangeRates(filteredRates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setExchangeRates({ USD: 1 });
      }
    };

    fetchExchangeRates();
  }, []);

  return exchangeRates;
};

export default useExchangeRates;
