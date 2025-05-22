// ExpensesBarChart.jsx
import React, { useState, useEffect } from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ExpensesBarChart = ({ expenses = [] }) => {
  const [viewMode, setViewMode] = useState('week');
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // Process expenses data into grouped format
  useEffect(() => {
    const processExpenses = () => {
      const grouped = {};
      
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();

        if (!grouped[year]) {
          grouped[year] = {};
        }
        if (!grouped[year][month]) {
          grouped[year][month] = {};
        }
        if (!grouped[year][month][day]) {
          grouped[year][month][day] = 0;
        }
        grouped[year][month][day] += expense.amount;
      });

      setGroupedData(grouped);
    };

    processExpenses();
  }, [expenses]);

  // Handle view mode changes
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownSelect = (option) => {
    setSelectedDropdown(option);
    setAnchorEl(null);
  };

  const closeDropdownMenu = () => {
    setAnchorEl(null);
  };

  // Generate months for a year
  const generateMonths = (year) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return months.map((month) => ({
      name: month,
      value: groupedData[year]?.[month]
        ? Object.values(groupedData[year][month]).reduce((sum, dayValue) => sum + dayValue, 0)
        : 0,
    }));
  };

  // Generate days for a month
  const generateDays = (year, month) => {
    const monthIndex = new Date(`${month} 1 ${year}`).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      name: `${month} ${i + 1}`,
      value: groupedData[year]?.[month]?.[i + 1] || 0,
    }));
  };

  // Generate weeks for a month
  const generateWeekOptions = (year, month) => {
    const monthIndex = new Date(`${month} 1 ${year}`).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const weeks = [];
    const totalWeeks = Math.ceil(daysInMonth / 7);

    for (let i = 1; i <= totalWeeks; i++) {
      weeks.push(`Week ${i}`);
    }

    return weeks;
  };

  // Generate days for a specific week
  const generateWeekData = (year, month, weekNumber) => {
    const monthIndex = new Date(`${month} 1 ${year}`).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);

    const weekData = [];
    for (let day = startDay; day <= endDay; day++) {
      weekData.push({
        name: `${month} ${day}`,
        value: groupedData[year]?.[month]?.[day] || 0,
      });
    }

    return weekData;
  };

  // Generate month options
  const generateMonthOptions = () => [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  // Generate year options
  const generateYearOptions = () => Object.keys(groupedData).sort();

  // Initialize dropdown and data based on view mode
  useEffect(() => {
    if (viewMode === 'all') {
      setDropdownOptions([]);
      setSelectedDropdown('');
      const yearlyData = Object.keys(groupedData).map((year) => ({
        name: year,
        value: Object.values(groupedData[year] || {}).reduce(
          (sum, month) => sum + Object.values(month || {}).reduce((s, day) => s + day, 0),
          0
        ),
      }));
      setData(yearlyData);
    } else if (viewMode === 'year') {
      const yearOptions = generateYearOptions();
      setDropdownOptions(yearOptions);
      const currentYear = new Date().getFullYear().toString();
      const selectedYear = yearOptions.includes(currentYear) ? currentYear : yearOptions[0] || '';
      setSelectedDropdown(selectedYear);
      setData(generateMonths(selectedYear));
    } else if (viewMode === 'month') {
      const monthOptions = generateMonthOptions();
      setDropdownOptions(monthOptions);
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const selectedMonth = monthOptions.includes(currentMonth) ? currentMonth : monthOptions[0];
      setSelectedDropdown(selectedMonth);
      const currentYear = new Date().getFullYear().toString();
      setData(generateDays(currentYear, selectedMonth));
    } else if (viewMode === 'week') {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const weekOptions = generateWeekOptions(currentYear, currentMonth);
      setDropdownOptions(weekOptions);
      setSelectedDropdown(weekOptions[0] || '');
      setData(generateWeekData(currentYear, currentMonth, 1));
    }
  }, [viewMode, groupedData]);

  // Update data when dropdown selection changes
  useEffect(() => {
    if (!selectedDropdown) return;

    if (viewMode === 'year') {
      setData(generateMonths(selectedDropdown));
    } else if (viewMode === 'month') {
      const currentYear = new Date().getFullYear().toString();
      setData(generateDays(currentYear, selectedDropdown));
    } else if (viewMode === 'week') {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const weekNumber = parseInt(selectedDropdown.replace('Week ', '')) || 1;
      setData(generateWeekData(currentYear, currentMonth, weekNumber));
    }
  }, [selectedDropdown, viewMode]);

  return (
    <Box sx={{ width: '100%', height: '100%', background: 'white', borderRadius: 3, boxShadow: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, mb: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            },
          }}
        >
          <ToggleButton value="week" aria-label="week view">Week</ToggleButton>
          <ToggleButton value="month" aria-label="month view">Month</ToggleButton>
          <ToggleButton value="year" aria-label="year view">Year</ToggleButton>
          <ToggleButton value="all" aria-label="all time view">All</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {viewMode !== 'all' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDropdownToggle}
            endIcon={<ArrowDropDown />}
            sx={{
              textTransform: 'none',
              minWidth: '120px',
              borderColor: 'rgba(0, 0, 0, 0.23)',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>{selectedDropdown}</Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeDropdownMenu}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: 3,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            {dropdownOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleDropdownSelect(option)}
                selected={option === selectedDropdown}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    },
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
      <Box sx={{ width: '100%', height: 400, pt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 40, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#ccc' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [`$${value}`, 'Expenses']}
            />
            <Legend />
            <Bar
              dataKey="value"
              fill="#1976d2"
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ExpensesBarChart;
