import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';

const TimeRangeToggle = ({ timeRange, onTimeRangeChange }) => {
  const handleChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      onTimeRangeChange(newTimeRange);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <ToggleButtonGroup
        value={timeRange}
        exclusive
        onChange={handleChange}
        aria-label="time range"
        size="small"
        sx={{ width: 360 }}
      >
        <ToggleButton value="week" aria-label="week view" sx={{ minWidth: 80, flex: 1 }}>
          Week
        </ToggleButton>
        <ToggleButton value="month" aria-label="month view" sx={{ minWidth: 80, flex: 1 }}>
          Month
        </ToggleButton>
        <ToggleButton value="year" aria-label="year view" sx={{ minWidth: 80, flex: 1 }}>
          Year
        </ToggleButton>
        <ToggleButton value="all" aria-label="all time view" sx={{ minWidth: 80, flex: 1 }}>
          All
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeRangeToggle; 