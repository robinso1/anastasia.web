import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Budget: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Сметы
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список смет.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Budget; 