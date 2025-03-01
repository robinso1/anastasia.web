import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Documents: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Архив документов
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список документов.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Documents; 