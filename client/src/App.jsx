import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import theme, { darkTheme } from './theme';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [mode, setMode] = useState('light');

  const currentTheme = useMemo(() => {
    return mode === 'light' ? theme : darkTheme;
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Dashboard onToggleTheme={toggleTheme} />
      </Router>
    </ThemeProvider>
  );
};

export default App; 