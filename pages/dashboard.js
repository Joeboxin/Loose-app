import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import FinancialPieChart from '@/components/Dashboard/FinancialPieChart';
import CurrencySelector from '@/components/Dashboard/CurrencySelector';
import ThemeToggle from '@/components/Dashboard/ThemeToggle';
import FinancialEntryForm from '@/components/Dashboard/FinancialEntryForm';
import FinancialList from '@/components/Dashboard/FinancialList';
import { getDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useStateContext } from '@/context/StateContext';
import useExchangeRates from '@/hooks/useExchangeRates';
import { database } from '@/backend/Firebase';

const lightTheme = {
  background: '#ffffff',
  text: '#0e131f',
  primary: '#55d59e',
  secondary: '#f5f5f5',
  border: '#ddd',
};

const darkTheme = {
  background: '#0e131f',
  text: '#ffffff',
  primary: '#45b88d',
  secondary: '#1a1f2b',
  border: '#555',
};

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;

const Dashboard = () => {
  const exchangeRates = useExchangeRates();
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('light'); // Default to light theme
  const [financialData, setFinancialData] = useState({});
  const { user } = useStateContext();

  // Fetch theme and financial data from Firestore when the component mounts
  useEffect(() => {
    if (user) {
      const userRef = doc(database, 'users', user.uid);

      // Fetch theme and financial data
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTheme(data.theme || 'light'); // Set theme from Firestore or default to 'light'
          setFinancialData(data.financialData || {}); // Set financial data
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const convertCurrency = (amount) => {
    return amount * (exchangeRates[currency] || 1);
  };

  // Toggle theme and save it to Firestore
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (user) {
      const userRef = doc(database, 'users', user.uid);
      await setDoc(userRef, { theme: newTheme }, { merge: true }); // Save theme to Firestore
    }
  };

  const handleAddEntry = async (newEntry) => {
    if (!user) return;

    const { category, subcategory, amount } = newEntry;
    if (!category || !subcategory || amount <= 0) return;

    const updatedData = {
      ...financialData,
      [category]: {
        ...financialData[category],
        [subcategory]: (financialData[category]?.[subcategory] || 0) + amount,
      },
    };

    setFinancialData(updatedData);

    const financialDataRef = doc(database, 'users', user.uid);
    await setDoc(financialDataRef, { financialData: updatedData }, { merge: true });
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <AppContainer>
        <Navbar />
        <CurrencySelector currency={currency} setCurrency={setCurrency} />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <FinancialEntryForm handleAddEntry={handleAddEntry} />
        <FinancialPieChart financialData={financialData} convertCurrency={convertCurrency} />
        <FinancialList financialData={financialData} convertCurrency={convertCurrency} currency={currency} />
      </AppContainer>
    </ThemeProvider>
  );
};

export default Dashboard;