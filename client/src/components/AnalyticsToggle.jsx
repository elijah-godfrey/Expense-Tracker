import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import { BarChart, PieChart } from '@mui/icons-material';

const AnalyticsToggle = ({ view, onViewChange }) => {
  const handleChange = (event, newView) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleChange}
        aria-label="analytics view"
        size="small"
      >
        <ToggleButton value="bar" aria-label="bar chart view">
          <BarChart sx={{ mr: 1 }} />
          Bar Chart
        </ToggleButton>
        <ToggleButton value="pie" aria-label="pie chart view">
          <PieChart sx={{ mr: 1 }} />
          Pie Chart
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default AnalyticsToggle; 