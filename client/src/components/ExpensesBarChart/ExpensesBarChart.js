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
import axios from 'axios';

const ExpensesBarChart = () => {
  const [viewMode, setViewMode] = useState('year'); // Default to "year"
  const [data, setData] = useState([]); // Data for the bar chart
  const [groupedData, setGroupedData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null); // Dropdown anchor
  const [selectedDropdown, setSelectedDropdown] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

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
      value:
        groupedData[year]?.[month]
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

  // Generate weeks for a month (Week 1, Week 2, etc.)
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

  // Fetch summary data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses/summary');
        const summary = response.data;

        // Save grouped data
        setGroupedData(summary.groupedData);

        // Initialize dropdown and selectedDropdown based on default viewMode
        if (viewMode === 'all') {
          setDropdownOptions([]);
          setSelectedDropdown('');
        } else if (viewMode === 'year') {
          const yearOptions = generateYearOptions();
          setDropdownOptions(yearOptions);
          const currentYear = new Date().getFullYear().toString();
          setSelectedDropdown(yearOptions.includes(currentYear) ? currentYear : yearOptions[0]);
        } else if (viewMode === 'month') {
          const monthOptions = generateMonthOptions();
          setDropdownOptions(monthOptions);
          const currentMonth = new Date().toLocaleString('default', { month: 'short' });
          setSelectedDropdown(monthOptions.includes(currentMonth) ? currentMonth : monthOptions[0]);
        } else if (viewMode === 'week') {
          const selectedYear = new Date().getFullYear().toString();
          const selectedMonth = new Date().toLocaleString('default', { month: 'short' });
          const weekOptions = generateWeekOptions(selectedYear, selectedMonth);
          setDropdownOptions(weekOptions);
          setSelectedDropdown(weekOptions[0]);
        }

        // Set initial data
        if (viewMode === 'all') {
          const yearlyData = Object.keys(summary.groupedData).map((year) => ({
            name: year,
            value: Object.values(summary.groupedData[year]).reduce(
              (sum, month) => sum + Object.values(month).reduce((s, day) => s + day, 0),
              0
            ),
          }));
          setData(yearlyData);
        } else if (viewMode === 'year') {
          const selectedYear = new Date().getFullYear().toString();
          setSelectedDropdown(selectedYear);
          const monthlyData = generateMonths(selectedYear);
          setData(monthlyData);
        } else if (viewMode === 'month') {
          const selectedMonth = new Date().toLocaleString('default', { month: 'short' });
          setSelectedDropdown(selectedMonth);
          const selectedYear = new Date().getFullYear().toString();
          setData(generateDays(selectedYear, selectedMonth));
        } else if (viewMode === 'week') {
          const selectedYear = new Date().getFullYear().toString();
          const selectedMonth = new Date().toLocaleString('default', { month: 'short' });
          setSelectedDropdown('Week 1');
          setData(generateWeekData(selectedYear, selectedMonth, 1));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update dropdown options based on view mode
  useEffect(() => {
    if (viewMode === 'all') {
      setDropdownOptions([]);
      setSelectedDropdown('');
    } else if (viewMode === 'year') {
      const yearOptions = generateYearOptions();
      setDropdownOptions(yearOptions);
      const currentYear = new Date().getFullYear().toString();
      setSelectedDropdown(yearOptions.includes(currentYear) ? currentYear : yearOptions[0]);
    } else if (viewMode === 'month') {
      const monthOptions = generateMonthOptions();
      setDropdownOptions(monthOptions);
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      setSelectedDropdown(monthOptions.includes(currentMonth) ? currentMonth : monthOptions[0]);
    } else if (viewMode === 'week') {
      const selectedYear = new Date().getFullYear().toString();
      const selectedMonth = new Date().toLocaleString('default', { month: 'short' });
      const weekOptions = generateWeekOptions(selectedYear, selectedMonth);
      setDropdownOptions(weekOptions);
      setSelectedDropdown(weekOptions.includes(selectedDropdown) ? selectedDropdown : weekOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, groupedData]);

  // Update bar chart data based on dropdown selection
  useEffect(() => {
    if (viewMode === 'all') {
      const yearlyData = Object.keys(groupedData).map((year) => ({
        name: year,
        value: Object.values(groupedData[year] || {}).reduce(
          (sum, month) => sum + Object.values(month || {}).reduce((s, day) => s + day, 0),
          0
        ),
      }));
      setData(yearlyData);
    } else if (viewMode === 'year') {
      const selectedYear = selectedDropdown;
      setData(generateMonths(selectedYear));
    } else if (viewMode === 'month') {
      const selectedYear = new Date().getFullYear().toString(); // Modify if you have year selection
      const selectedMonth = selectedDropdown;
      setData(generateDays(selectedYear, selectedMonth));
    } else if (viewMode === 'week') {
      const selectedYear = new Date().getFullYear().toString(); // Modify if necessary
      const selectedMonth = new Date().toLocaleString('default', { month: 'short' });
      const weekNumber = parseInt(selectedDropdown.replace('Week ', '')) || 1;
      setData(generateWeekData(selectedYear, selectedMonth, weekNumber));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDropdown, viewMode, groupedData]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {/* Toggle Button Group */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="View Mode"
        sx={{
          marginBottom: 2, // 16px
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Reordered Toggle Buttons: Year, Month, Week, All */}
        <ToggleButton
          value="year"
          aria-label="Year"
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            transition: 'background-color 0.3s, color 0.3s',
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: 'white',
              borderColor: '#1976d2',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#115293',
            },
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          Y
        </ToggleButton>
        <ToggleButton
          value="month"
          aria-label="Month"
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            transition: 'background-color 0.3s, color 0.3s',
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: 'white',
              borderColor: '#1976d2',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#115293',
            },
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          M
        </ToggleButton>
        <ToggleButton
          value="week"
          aria-label="Week"
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            transition: 'background-color 0.3s, color 0.3s',
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: 'white',
              borderColor: '#1976d2',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#115293',
            },
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          W
        </ToggleButton>
        <ToggleButton
          value="all"
          aria-label="All"
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px 16px',
            margin: '0 4px',
            backgroundColor: '#f5f5f5',
            color: '#333',
            transition: 'background-color 0.3s, color 0.3s',
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: 'white',
              borderColor: '#1976d2',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#115293',
            },
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          All
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Dropdown Menu */}
      {viewMode !== 'all' && (
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              marginRight: '8px',
              fontWeight: 500,
              color: '#333',
            }}
          >
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}:
          </Typography>
          <IconButton
            onClick={handleDropdownToggle}
            size="small"
            sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.3s, border-color 0.3s',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#999',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                marginRight: '4px',
                fontSize: '14px',
                color: '#333',
              }}
            >
              {selectedDropdown}
            </Typography>
            <ArrowDropDown />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeDropdownMenu}
            PaperProps={{
              sx: {
                borderRadius: '8px', // Curved borders for the menu
                mt: 1, // Margin top
                boxShadow: 3, // MUI box shadow
              },
            }}
            sx={{
              '& .MuiMenuItem-root': {
                borderRadius: '4px', // Rectangular highlighter
              },
              '& .Mui-selected': {
                backgroundColor: '#1976d2',
                color: 'white',
              },
              '& .Mui-selected:hover': {
                backgroundColor: '#115293',
              },
            }}
          >
            {dropdownOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleDropdownSelect(option)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {/* Bar Chart */}
      <Box
        sx={{
          width: '100%',
          height: '400px',
        }}
      >
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 40, right: 30, bottom: 40, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ExpensesBarChart;
