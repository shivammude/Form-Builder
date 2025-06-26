import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Paper, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem('user'));
    setUser(userObj);
    const userId = userObj ? userObj.id : null;
    const fetchForms = async () => {
      const response = await axios.get('/api/forms');
      const userForms = response.data.filter(form => form.userId === userId);
      setForms(userForms);
    };
    fetchForms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Your Forms</Typography>
        <Box display="flex" gap={2}>
          <Button component={Link} to="/forms/new" variant="contained" color="primary">
            Create Form
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Stack>
      {user && (
        <Typography variant="subtitle1" mb={2} color="textSecondary">
          Welcome, {user.username}
        </Typography>
      )}
      <Paper elevation={2} sx={{ p: 2 }}>
        <ul>
          {forms.map((form) => (
            <li key={form.id} style={{ marginBottom: 12 }}>
              <span>{form.title}</span>
              <Button
                component={Link}
                to={`/responses/${form.id}`}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              >
                View Responses
              </Button>
            </li>
          ))}
        </ul>
      </Paper>
    </Box>
  );
};

export default Dashboard;
