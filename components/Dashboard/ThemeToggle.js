import React from 'react';
import styled from 'styled-components';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <ToggleButton onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

export default ThemeToggle;
