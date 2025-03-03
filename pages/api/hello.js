import { useState, useEffect } from 'react';

const useExchangeRates = () => {
  const api_key = process.env.NEXT_PUBLIC_API_KEY;
  const [exchangeRates, setExchangeRates] = useState({ USD: 1 });

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${api_key}/latest/USD`);
        const data = await response.json();
        setExchangeRates(data.conversion_rates || { USD: 1 });
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
