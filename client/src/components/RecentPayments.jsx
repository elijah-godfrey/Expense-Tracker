import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  useTheme
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const RecentPayments = ({ payments = [], onViewAll }) => {
  const theme = useTheme();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Recent Payments</Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={onViewAll}
          sx={{ textTransform: 'none' }}
        >
          See All
        </Button>
      </Box>

      <List sx={{ mt: 2 }}>
        {payments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No recent payments
          </Typography>
        ) : (
          payments.map((payment, index) => (
            <ListItem
              key={payment.id || index}
              sx={{
                py: 1.5,
                borderBottom: index !== payments.length - 1 ? `1px solid ${theme.palette.divider}` : 'none'
              }}
            >
              <ListItemText
                primary={payment.description}
                secondary={formatDate(payment.date)}
                primaryTypographyProps={{
                  variant: 'body1',
                  sx: { fontWeight: 500 }
                }}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.secondary'
                }}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={payment.category}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: payment.amount < 0 ? 'error.main' : 'success.main'
                  }}
                >
                  {formatAmount(payment.amount)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default RecentPayments; 