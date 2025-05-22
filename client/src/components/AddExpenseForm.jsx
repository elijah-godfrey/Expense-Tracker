import React, { useState } from 'react';
import { Grid, TextField, Button, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddExpenseForm = ({ categories, onSubmit }) => {
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      return;
    }

    onSubmit({
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    });

    // Reset form
    setNewExpense({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={newExpense.category}
            label="Category"
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          type="submit"
          sx={{ height: '56px' }}
        >
          Add Expense
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddExpenseForm; 