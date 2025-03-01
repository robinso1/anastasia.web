import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Tasks: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Задачи
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список задач.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Tasks; 