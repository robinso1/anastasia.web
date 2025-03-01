import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Events: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Мероприятия
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список мероприятий.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Events; 