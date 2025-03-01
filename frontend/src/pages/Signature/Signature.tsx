import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Signature: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Электронная подпись
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться информация об электронной подписи.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signature; 