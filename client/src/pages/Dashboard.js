import React from 'react';
import { Container, Typography } from '@mui/material';
import ExpensesBarChart from '../components/ExpensesBarChart/ExpensesBarChart'; 
import './Dashboard.css';

function Dashboard() {
  return (
    <Container className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Overview
      </Typography>

      {/* Render our placeholder bar chart */}
      <ExpensesBarChart />
    </Container>
  );
}

export default Dashboard;
