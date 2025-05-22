import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseInsights from '../components/ExpenseInsights';
import ExpenseCategories from '../components/ExpenseCategories';
import SavingsGoals from '../components/SavingsGoals';
import ExpensesBarChart from '../components/ExpensesBarChart';
import ExpensesPieChart from '../components/ExpensesPieChart/ExpensesPieChart';
import Sidebar from '../components/Sidebar';
import AnalyticsToggle from '../components/AnalyticsToggle';
import TimeRangeToggle from '../components/TimeRangeToggle';
import RecentPayments from '../components/RecentPayments';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [analyticsView, setAnalyticsView] = useState('bar');
  const [timeRange, setTimeRange] = useState('month');

  // State for expenses, categories, goals, etc.
  const [categories, setCategories] = useState(['Food', 'Travel', 'Groceries', 'Utilities']);
  const [newCategory, setNewCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  const [highestCategory, setHighestCategory] = useState('');
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'Vacation', target: 2000, current: 500 },
    { id: 2, name: 'New Car', target: 15000, current: 3000 }
  ]);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalData, setEditGoalData] = useState({ name: '', target: '' });
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Compute recent payments from expenses, sorted by date descending
  const recentPayments = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  // Filter expenses based on time range
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 'all'
        return expenses;
    }

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= now;
    });
  }, [expenses, timeRange]);

  // Calculate insights
  useEffect(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    setTotalExpenses(total);
    setAverageExpense(filteredExpenses.length > 0 ? total / filteredExpenses.length : 0);
    
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + (expense.amount || 0);
      return acc;
    }, {});
    
    const highest = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];
    setHighestCategory(highest ? highest[0] : '');
  }, [filteredExpenses]);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const handleViewAllTransactions = () => {
    // TODO: Implement navigation to transactions page
    console.log('Navigate to transactions page');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: '100%',
          ml: 0 // Remove left margin so content is flush with sidebar
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setSidebarOpen(true)}
            sx={{ mb: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Add Expense Form */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <AddExpenseForm
              categories={categories}
              onSubmit={handleAddExpense}
            />
          </Paper>

          {/* Analytics Section - full width */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Expense Analytics</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TimeRangeToggle
                      timeRange={timeRange}
                      onTimeRangeChange={setTimeRange}
                    />
                    <AnalyticsToggle
                      view={analyticsView}
                      onViewChange={setAnalyticsView}
                    />
                  </Box>
                </Box>
                <Box sx={{ height: 400 }}>
                  {analyticsView === 'bar' ? (
                    <ExpensesBarChart expenses={filteredExpenses} timeRange={timeRange} />
                  ) : (
                    <ExpensesPieChart expenses={filteredExpenses} timeRange={timeRange} />
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Highlights & Recent Payments - highlights as separate rows */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <ExpenseInsights
                    totalExpenses={totalExpenses}
                    averageExpense={null}
                    highestCategory={null}
                    type="total"
                  />
                </Paper>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <ExpenseInsights
                    totalExpenses={null}
                    averageExpense={averageExpense}
                    highestCategory={null}
                    type="average"
                  />
                </Paper>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <ExpenseInsights
                    totalExpenses={null}
                    averageExpense={null}
                    highestCategory={highestCategory}
                    type="highest"
                  />
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', minHeight: 250, maxHeight: 350, overflowY: 'auto' }}>
                <RecentPayments
                  payments={recentPayments}
                  onViewAll={handleViewAllTransactions}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Categories and Goals */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ExpenseCategories
                categories={categories}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                onAddCategory={(category) => setCategories([...categories, category])}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SavingsGoals
                goals={savingsGoals}
                newGoal={newGoal}
                setNewGoal={setNewGoal}
                handleAddGoal={() => {
                  if (newGoal.name && newGoal.target) {
                    setSavingsGoals([...savingsGoals, { ...newGoal, id: Date.now(), current: 0 }]);
                    setNewGoal({ name: '', target: '' });
                  }
                }}
                editingGoalId={editingGoalId}
                editGoalData={editGoalData}
                handleEditGoal={(goal) => {
                  setEditingGoalId(goal.id);
                  setEditGoalData({ name: goal.name, target: goal.target });
                }}
                handleSaveEdit={() => {
                  setSavingsGoals(savingsGoals.map(goal =>
                    goal.id === editingGoalId
                      ? { ...goal, name: editGoalData.name, target: Number(editGoalData.target) }
                      : goal
                  ));
                  setEditingGoalId(null);
                  setEditGoalData({ name: '', target: '' });
                }}
                handleCancelEdit={() => {
                  setEditingGoalId(null);
                  setEditGoalData({ name: '', target: '' });
                }}
                isMobile={isMobile}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
