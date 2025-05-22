import React from 'react';
import { Paper, Typography } from '@mui/material';

const ExpenseInsights = ({ totalExpenses, averageExpense, highestCategory, type }) => {
  let title = '';
  let value = '';

  if (type === 'total') {
    title = 'Total Expenses';
    value =
      typeof totalExpenses === 'number'
        ? `$${totalExpenses.toFixed(2)}`
        : '--';
  } else if (type === 'average') {
    title = 'Average Expense';
    value =
      typeof averageExpense === 'number'
        ? `$${averageExpense.toFixed(2)}`
        : '--';
  } else if (type === 'highest') {
    title = 'Highest Spending Category';
    value = highestCategory || '--';
  }

  return (
    <Paper elevation={2} sx={{ padding: 2, textAlign: 'center', bgcolor: 'white' }}>
      <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default ExpenseInsights; 