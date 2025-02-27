import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';

import { useRouter } from 'next/router';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // For pie chart
import { getDoc, doc, setDoc, onSnapshot} from 'firebase/firestore'; // For Firestore operations
import { database } from '@/backend/Firebase'; // Import Firestore instance
import { useStateContext } from '@/context/StateContext';


const lightTheme = {
  background: '#ffffff',
  text: '#0e131f',
  primary: '#55d59e',
  secondary: '#f5f5f5',
};

const darkTheme = {
  background: '#0e131f',
  text: '#ffffff',
  primary: '#45b88d',
  secondary: '#1a1f2b',
};


const Dashboard = () => {
  const { user } = useStateContext();
  const [financialData, setFinancialData] = useState([]);
  const [newEntry, setNewEntry] = useState({ category: '', amount: 0 });
  const [editingIndex, setEditingIndex] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [theme, setTheme] = useState('light');
  const router = useRouter();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };
  const convertCurrency = (amount) => {
    return (amount * exchangeRate).toFixed(2);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  // Fetch financial data from Firestore
  useEffect(() => {
    if (!user) return;
  
    const userDocRef = doc(database, 'users', user.uid);
  
    // Real-time listener for financialData
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFinancialData(docSnap.data().financialData || []);
      }
    });
  
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [user?.uid]);
  

  // Add a new financial entry
  const handleAddEntry = async () => {
    if (!newEntry.category || !newEntry.amount) {
      alert('Please fill in all fields.');
      return;
    }

    const updatedData = [...financialData, newEntry];
    setFinancialData(updatedData);

    // Update Firestore
    await setDoc(doc(database, 'users', user.uid), { financialData: updatedData }, { merge: true });

    // Clear the form
    setNewEntry({ category: '', amount: 0 });
  };

  // Edit an existing entry
  const handleEditEntry = (index) => {
    setEditingIndex(index);
    setNewEntry(financialData[index]);
  };

  // Update an existing entry
  const handleUpdateEntry = async () => {
    if (!newEntry.category || !newEntry.amount) {
      alert('Please fill in all fields.');
      return;
    }

    const updatedData = [...financialData];
    updatedData[editingIndex] = newEntry;
    setFinancialData(updatedData);

    // Update Firestore
    await setDoc(doc(database, 'users', user.uid), { financialData: updatedData }, { merge: true });

    // Clear the form and reset editing state
    setNewEntry({ category: '', amount: 0 });
    setEditingIndex(null);
  };

  // Delete an entry
  const handleDeleteEntry = async (index) => {
    const updatedData = financialData.filter((_, i) => i !== index);
    setFinancialData(updatedData);

    // Update Firestore
    await setDoc(doc(database, 'users', user.uid), { financialData: updatedData }, { merge: true });
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Section>
        <Navbar />
        <Container>
          <Header>Dashboard</Header>
    
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </ThemeToggle>

          {/* Currency Selector */}
          <CurrencySelector>
            <label>Currency:</label>
            <select value={currency} onChange={handleCurrencyChange}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </CurrencySelector>

          {/* Add New Entry Form */}
          <Form>
            <Input
              type="text"
              placeholder="Category (e.g., Food, Rent)"
              value={newEntry.category}
              onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newEntry.amount}
              onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) })}
            />
            <Button onClick={handleAddEntry}>Add Entry</Button>
          </Form>

          {/* Pie Chart */}
          <ChartContainer>
            <PieChart width={400} height={400}>
              <Pie
                data={financialData}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {financialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>

          {/* Display Financial Data */}
          <FinancialList>
            <h3>Financial Entries</h3>
            {financialData.length === 0 ? (
              <p>No financial data found. Add some entries!</p>
            ) : (
              financialData.map((entry, index) => (
                <Entry key={index}>
                  <span>{entry.category}</span>
                  <span>
                    {currency} {convertCurrency(entry.amount)}
                  </span>
                </Entry>
              ))
            )}
          </FinancialList>
        </Container>
      </Section>
    </ThemeProvider>
  );
};

// STYLED COMPONENTS
const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const ThemeToggle = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const CurrencySelector = styled.div`
  margin-bottom: 20px;

  label {
    margin-right: 10px;
    color: ${({ theme }) => theme.text};
  }

  select {
    padding: 5px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

const Form = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary}99;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const FinancialList = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.text};
  }
`;

const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;

  span {
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }
`;

export default Dashboard;