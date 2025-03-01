import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Projects: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Проекты
      </Typography>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">
          Здесь будет отображаться список проектов.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Projects; 