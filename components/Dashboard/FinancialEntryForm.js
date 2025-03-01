import React, { useState } from 'react';
import styled from 'styled-components';

const FinancialEntryForm = ({ handleAddEntry }) => {
  const [newEntry, setNewEntry] = useState({ category: '', subcategory: '', amount: 0 });

  return (
    <Form>
      <Input
        type="text"
        placeholder="Category"
        value={newEntry.category}
        onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
      />
      <Input
        type="text"
        placeholder="Subcategory"
        value={newEntry.subcategory}
        onChange={(e) => setNewEntry({ ...newEntry, subcategory: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={newEntry.amount}
        onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) })}
      />
      <Button onClick={() => handleAddEntry(newEntry)}>Add Entry</Button>
    </Form>
  );
};

const Form = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 8px;
  border-radius: 5px;
  font-size: 16px;
  width: 200px;
  
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

export default FinancialEntryForm;
