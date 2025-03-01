import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Contacts: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Контакты
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список контактов.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Contacts; 