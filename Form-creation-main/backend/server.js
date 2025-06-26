const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let forms = [];
let responses = [];

const dbPath = path.join(__dirname, 'db.json');
function readUsers() {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return db.users || [];
}
function writeUsers(users) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  db.users = users;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  console.log('Register request:', req.body);
  if (!username || !password) {
    console.log('Register error: Username and password required');
    return res.json({ success: false, error: 'Username and password required' });
  }
  let users = readUsers();
  if (users.find(u => u.username === username)) {
    console.log('Register error: Username already exists');
    return res.json({ success: false, error: 'Username already exists' });
  }
  const newUser = { id: uuidv4(), username, password, role: 'user' };
  users.push(newUser);
  writeUsers(users);
  console.log('Register success:', newUser);
  res.json({ success: true, user: newUser });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request:', req.body);
  if (!username || !password) {
    console.log('Login error: Username and password required');
    return res.json({ success: false, error: 'Username and password required' });
  }
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    console.log('Login error: Invalid username or password');
    return res.json({ success: false, error: 'Invalid username or password' });
  }
  console.log('Login success, user returned:', user);
  res.json({ success: true, user });
});

app.get('/api/forms', (req, res) => {
  res.json(forms);
});

app.post('/api/forms', (req, res) => {
  const form = { id: uuidv4(), ...req.body };
  forms.push(form);
  res.status(201).json(form);
});

app.get('/api/forms/:id', (req, res) => {
  const form = forms.find(f => f.id === req.params.id);
  res.json(form || {});
});

app.post('/api/responses', (req, res) => {
  const response = { id: uuidv4(), ...req.body };
  responses.push(response);
  res.status(201).json(response);
});

app.get('/api/responses/:formId', (req, res) => {
  const formResponses = responses.filter(r => r.formId === req.params.formId);
  res.json(formResponses);
});

// Add this endpoint for admin dashboard
app.get('/api/users', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'));
  res.json({ users: db.users || [] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
