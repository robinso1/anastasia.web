import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Messages: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Сообщения
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список сообщений.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Messages; 