import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line
} from 'recharts';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ExpensesBarChart = ({ expenses = [], timeRange = 'month' }) => {
  const theme = useTheme();
  const now = new Date();

  // Group and sum expenses by the correct x-axis unit
  const data = useMemo(() => {
    let grouped = {};
    let labels = [];
    let counts = {};

    if (timeRange === 'week') {
      const curr = new Date(now);
      const day = curr.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(curr);
      monday.setDate(curr.getDate() + diffToMonday);
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        labels.push(label);
        grouped[label] = 0;
        counts[label] = 0;
      }
      expenses.forEach(exp => {
        const date = new Date(exp.date);
        for (let i = 0; i < 7; i++) {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          if (
            date.getFullYear() === d.getFullYear() &&
            date.getMonth() === d.getMonth() &&
            date.getDate() === d.getDate()
          ) {
            const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            grouped[label] += Math.abs(exp.amount);
            counts[label] += 1;
          }
        }
      });
    } else if (timeRange === 'month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(label);
        grouped[label] = 0;
        counts[label] = 0;
      }
      expenses.forEach(exp => {
        const date = new Date(exp.date);
        if (date.getFullYear() === year && date.getMonth() === month) {
          const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (grouped[label] !== undefined) {
            grouped[label] += Math.abs(exp.amount);
            counts[label] += 1;
          }
        }
      });
    } else if (timeRange === 'year') {
      const year = now.getFullYear();
      labels = MONTHS.map(m => `${m} ${year.toString().slice(-2)}`);
      labels.forEach(label => {
        grouped[label] = 0;
        counts[label] = 0;
      });
      expenses.forEach(exp => {
        const date = new Date(exp.date);
        if (date.getFullYear() === year) {
          const label = `${MONTHS[date.getMonth()]} ${year.toString().slice(-2)}`;
          if (grouped[label] !== undefined) {
            grouped[label] += Math.abs(exp.amount);
            counts[label] += 1;
          }
        }
      });
    } else {
      const years = {};
      const yearCounts = {};
      expenses.forEach(exp => {
        const date = new Date(exp.date);
        const year = date.getFullYear();
        years[year] = (years[year] || 0) + Math.abs(exp.amount);
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      });
      labels = Object.keys(years).sort();
      labels.forEach(year => {
        grouped[year] = years[year];
        counts[year] = yearCounts[year] || 0;
      });
    }

    return labels.map((label, idx) => ({
      label,
      amount: grouped[label] || 0,
      avg: counts[label] > 0 ? grouped[label] / counts[label] : 0,
      showLabel: timeRange === 'month' ? (idx % 7 === 0) : true
    }));
  }, [expenses, timeRange, now]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 120
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{label}</Typography>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
            {formatCurrency(payload[0].value)}
          </Typography>
          {payload[1] && (
            <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 700 }}>
              Avg: {formatCurrency(payload[1].value)}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        barCategoryGap={"30%"}
        barGap={2}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.9} />
            <stop offset="100%" stopColor={theme.palette.primary.light} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.5} />
        <XAxis
          dataKey="label"
          stroke={theme.palette.text.secondary}
          tick={{ fill: theme.palette.text.secondary, fontWeight: 500 }}
          interval={0}
          tickFormatter={(label, idx) => {
            if (timeRange === 'month') {
              return data[idx].showLabel ? label : '';
            }
            return label;
          }}
        />
        <YAxis
          stroke={theme.palette.text.secondary}
          tick={{ fill: theme.palette.text.secondary, fontWeight: 500 }}
          tickFormatter={formatCurrency}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover, opacity: 0.2 }} />
        <Bar
          dataKey="amount"
          name="Expenses"
          fill="url(#barGradient)"
          radius={0}
          maxBarSize={40}
          style={{ filter: 'drop-shadow(0 2px 8px rgba(25, 118, 210, 0.10))' }}
        />
        <Line
          type="monotone"
          dataKey="avg"
          name="Average"
          stroke={theme.palette.secondary.main}
          strokeWidth={3}
          dot={{ r: 4, fill: theme.palette.secondary.main, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpensesBarChart; 