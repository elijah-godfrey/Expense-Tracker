import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  '#2196f3', // primary
  '#03a9f4', // secondary
  '#4caf50', // success
  '#ff9800', // warning
  '#f44336', // error
  '#9c27b0', // purple
  '#009688', // teal
  '#ff5722', // deep orange
];

const ExpensesPieChart = ({ expenses = [], timeRange = 'month' }) => {
  const theme = useTheme();

  const data = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(expense.amount);
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  }, [expenses]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: 1,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(data.value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke={theme.palette.background.paper}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value, entry) => (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
              {value}
            </Typography>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesPieChart; 