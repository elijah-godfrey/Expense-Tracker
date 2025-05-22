import React from 'react';
import { Paper, Typography, Box, TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';

const ExpenseCategories = ({ categories, newCategory, setNewCategory, handleAddCategory, isMobile }) => (
  <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', height: '100%' }}>
    <Typography variant="h6" gutterBottom>Expense Categories</Typography>
    <Box sx={{ display: 'flex', marginBottom: 2, flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
      <TextField
        label="New Category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleAddCategory}>Add Category</Button>
    </Box>
    <List>
      {categories.map((category) => (
        <React.Fragment key={category}>
          <ListItem>
            <ListItemText primary={category} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  </Paper>
);

export default ExpenseCategories; 