import React from 'react';
import { Paper, Typography, Box, TextField, Button, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const calculateProgress = (current, target) => (current / target) * 100;

const SavingsGoals = ({
  goals,
  newGoal,
  setNewGoal,
  handleAddGoal,
  editingGoalId,
  editGoalData,
  handleEditGoal,
  handleSaveEdit,
  handleCancelEdit,
  isMobile
}) => (
  <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', height: '100%' }}>
    <Typography variant="h6" gutterBottom>Savings Goals</Typography>
    <Box sx={{ display: 'flex', marginBottom: 2, flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
      <TextField
        label="Goal Name"
        value={newGoal.name}
        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
        fullWidth
      />
      <TextField
        label="Target Amount"
        type="number"
        value={newGoal.target}
        onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
        fullWidth
      />
      <Button variant="contained" onClick={handleAddGoal}>Add Goal</Button>
    </Box>
    <List>
      {goals.map((goal) => (
        <React.Fragment key={goal.id}>
          <ListItem>
            {editingGoalId === goal.id ? (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Goal Name"
                    value={editGoalData.name}
                    onChange={(e) => handleEditGoal({ ...editGoalData, name: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Target Amount"
                    type="number"
                    value={editGoalData.target}
                    onChange={(e) => handleEditGoal({ ...editGoalData, target: e.target.value })}
                    fullWidth
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <ListItemText
                    primary={goal.name}
                    secondary={
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">${goal.current} / ${goal.target}</Typography>
                          <Typography variant="body2">{calculateProgress(goal.current, goal.target).toFixed(1)}%</Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 1 }}>
                          <Box
                            sx={{
                              width: `${calculateProgress(goal.current, goal.target)}%`,
                              height: '100%',
                              bgcolor: '#4caf50',
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleEditGoal(goal)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  </Paper>
);

export default SavingsGoals; 