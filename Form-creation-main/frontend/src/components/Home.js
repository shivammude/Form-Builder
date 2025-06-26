import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

const Home = () => {
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <Paper elevation={4} sx={{ p: 6, minWidth: 350, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" mb={2} color="primary">Form Builder</Typography>
        <Typography variant="h6" mb={4} color="textSecondary">
          Welcome to the Form Builder App. Create, share, and analyze forms easily!
        </Typography>
        <Stack spacing={2} direction="column" alignItems="center">
          <Button component={Link} to="/login" variant="contained" color="primary" size="large" fullWidth>
            Login
          </Button>
          <Button component={Link} to="/register" variant="outlined" color="primary" size="large" fullWidth>
            Register
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Home;
