import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import useExchangeRates from '@/hooks/useExchangeRates';
import styled from 'styled-components';

// Define fixed colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const FinancialPieChart = ({ financialData, convertCurrency }) => {
  if (!financialData || Object.keys(financialData).length === 0) return <p>No data available.</p>;

  const categoryData = Object.keys(financialData).map(category => ({
    name: category,
    value: Object.values(financialData[category]).reduce((a, b) => a + convertCurrency(b), 0),
  }));

  return (
    <ChartContainer>
      <PieChart width={400} height={400}>
        <Pie
          data={categoryData}
          cx={200}
          cy={200}
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {categoryData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

export default FinancialPieChart;