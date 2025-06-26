import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography, Paper, Stack } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { exportToExcel } from '../utils';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data.users || []);
      } catch (err) {
        setUsers([]);
      }
    };

    const fetchForms = async () => {
      try {
        const response = await axios.get('/api/forms');
        setForms(response.data.forms || response.data || []);
      } catch (err) {
        setForms([]);
      }
    };

    fetchUsers();
    fetchForms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Helper to get username by userId
  const getUsername = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : userId;
  };

  const handleExport = async (formId, formTitle) => {
    try {
      const response = await axios.get(`/api/responses/${formId}`);
      const data = response.data.map(r => ({
        ...r.data,
        email: r.email,
        createdAt: r.createdAt
      }));
      exportToExcel(data, formTitle || `responses_${formId}`);
    } catch (err) {
      alert('Failed to export responses');
    }
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <ul className="mb-4">
        {(users || []).map(user => (
          <li key={user.id} className="border p-2 mb-2 rounded">
            {user.username} - {user.role}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Forms</h2>
      <ul>
        {(forms || []).map(form => (
          <li key={form.id} className="border p-2 mb-2 rounded" style={{ marginBottom: 12 }}>
            {form.title} - Created by: {getUsername(form.userId)}
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
            <Button
              variant="outlined"
              color="success"
              size="small"
              sx={{ ml: 2 }}
              onClick={() => handleExport(form.id, form.title)}
            >
              Export Responses
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default AdminDashboard;
