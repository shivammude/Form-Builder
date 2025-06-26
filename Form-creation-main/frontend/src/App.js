import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  // MUI Components
  AppBar, Avatar, Box, Button, Card, CardContent, Checkbox, Chip,
  CircularProgress, Container, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControl, FormControlLabel, FormGroup,
  FormHelperText, FormLabel, Grid, IconButton, InputAdornment,
  InputLabel, LinearProgress, Link, List, ListItem, ListItemAvatar,
  ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem,
  Paper, Radio, RadioGroup, Select, Snackbar, Stack, Switch,
  Tab, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Tabs, TextField, Toolbar, Tooltip,
  Typography
} from '@mui/material';
import {
  // MUI Icons
  Add, AddCircleOutline, ArrowBack, ArrowForward, BarChart,
  Check, Close, CloudUpload, ContentCopy, Delete, Description,
  Edit, Email, ExitToApp, Face, FiberManualRecord, FileCopy,
  FilterList, Folder, Group, InsertDriveFile, Link as LinkIcon,
  ListAlt, Lock, MoreVert, Palette, Person, PieChart, Poll,
  Public, RadioButtonChecked, RadioButtonUnchecked, Send,
  Settings, Share, ShortText, TextFields, Timer, Today,
  ToggleOff, ToggleOn, Visibility, VisibilityOff,
  ArrowDropDown, LinearScale
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, purple } from '@mui/material/colors';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import FormBuilder from './components/FormBuilder';
import ViewForm from './components/FormView';
import FormResponses from './components/FormResponses';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';

// 1. AUTHENTICATION SYSTEM ========================================
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Use the same key as in Login.js
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Mock API functions
  const login = async (email, password) => {
    // In a real app, this would be an API call
    const mockUsers = [
      { id: '1', email: 'admin@form.com', password: 'admin123', name: 'Admin', role: 'admin' },
      { id: '2', email: 'user@form.com', password: 'user123', name: 'Test User', role: 'user' }
    ];
    
    const foundUser = mockUsers.find(u => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      localStorage.setItem('formUser', JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = async (name, email, password) => {
    // In a real app, this would be an API call
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password,
      role: 'user'
    };
    localStorage.setItem('formUser', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('formUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <CircularProgress />;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

// 2. FORM BUILDER COMPONENTS =====================================
const QUESTION_TYPES = {
  SHORT_TEXT: {
    id: 'SHORT_TEXT',
    name: 'Short Answer',
    icon: <ShortText />,
    component: ShortTextInput
  },
  PARAGRAPH: {
    id: 'PARAGRAPH',
    name: 'Paragraph',
    icon: <TextFields />,
    component: ParagraphInput
  },
  MULTIPLE_CHOICE: {
    id: 'MULTIPLE_CHOICE',
    name: 'Multiple Choice',
    icon: <RadioButtonChecked />,
    component: MultipleChoiceInput
  },
  CHECKBOXES: {
    id: 'CHECKBOXES',
    name: 'Checkboxes',
    icon: <Check />,
    component: CheckboxInput
  },
  DROPDOWN: {
    id: 'DROPDOWN',
    name: 'Dropdown',
    icon: <ArrowDropDown />,
    component: DropdownInput
  },
  LINEAR_SCALE: {
    id: 'LINEAR_SCALE',
    name: 'Linear Scale',
    icon: <LinearScale />,
    component: LinearScaleInput
  },
  DATE: {
    id: 'DATE',
    name: 'Date',
    icon: <Today />,
    component: DateInput
  },
  TIME: {
    id: 'TIME',
    name: 'Time',
    icon: <Timer />,
    component: TimeInput
  }
};

// --- Placeholder input components for form builder ---
function ShortTextInput({ question, previewMode }) {
  return <input type="text" placeholder={question?.placeholder || ''} disabled={previewMode} />;
}
function ParagraphInput({ question, previewMode }) {
  return <textarea placeholder={question?.placeholder || ''} disabled={previewMode} />;
}
function MultipleChoiceInput({ question, previewMode }) {
  return (
    <div>
      {(question.options || []).map((opt, i) => (
        <label key={i} style={{ display: 'block' }}>
          <input type="radio" name={question.id} disabled={previewMode} /> {opt}
        </label>
      ))}
    </div>
  );
}
function CheckboxInput({ question, previewMode }) {
  return (
    <div>
      {(question.options || []).map((opt, i) => (
        <label key={i} style={{ display: 'block' }}>
          <input type="checkbox" name={question.id} disabled={previewMode} /> {opt}
        </label>
      ))}
    </div>
  );
}
function DropdownInput({ question, previewMode }) {
  return (
    <select disabled={previewMode}>
      {(question.options || []).map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
function LinearScaleInput({ question, previewMode }) {
  const min = question.minValue || 1;
  const max = question.maxValue || 5;
  return (
    <div>
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(val => (
        <label key={val} style={{ marginRight: 8 }}>
          <input type="radio" name={question.id} disabled={previewMode} /> {val}
        </label>
      ))}
    </div>
  );
}
function DateInput({ question, previewMode }) {
  return <input type="date" disabled={previewMode} />;
}
function TimeInput({ question, previewMode }) {
  return <input type="time" disabled={previewMode} />;
}

function QuestionEditor({ 
  question, 
  index, 
  onUpdate, 
  onDelete,
  onDuplicate 
}) {
  const [editing, setEditing] = useState(false);
  
  const handleChange = (field, value) => {
    onUpdate({
      ...question,
      [field]: value
    });
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate({
      ...question,
      options: newOptions
    });
  };

  const addOption = () => {
    onUpdate({
      ...question,
      options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`]
    });
  };

  const removeOption = (optionIndex) => {
    const newOptions = [...question.options];
    newOptions.splice(optionIndex, 1);
    onUpdate({
      ...question,
      options: newOptions
    });
  };

  const QuestionComponent = QUESTION_TYPES[question.type].component;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {editing ? (
          <Box>
            <TextField
              fullWidth
              variant="filled"
              label="Question"
              value={question.text}
              onChange={(e) => handleChange('text', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              variant="standard"
              label="Description (optional)"
              value={question.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={question.type}
                label="Question Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                {Object.values(QUESTION_TYPES).map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    <Box display="flex" alignItems="center">
                      {type.icon}
                      <Box ml={1}>{type.name}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(question.type) && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Options
                </Typography>
                {question.options?.map((option, i) => (
                  <Box key={i} display="flex" alignItems="center" mb={1}>
                    {question.type === 'MULTIPLE_CHOICE' && <FiberManualRecord fontSize="small" />}
                    {question.type === 'CHECKBOXES' && <Check fontSize="small" />}
                    {question.type === 'DROPDOWN' && <span>{i + 1}.</span>}
                    <Box ml={1} flexGrow={1}>
                      <TextField
                        fullWidth
                        size="small"
                        value={option}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                      />
                    </Box>
                    <IconButton onClick={() => removeOption(i)} size="small">
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={addOption}
                  size="small"
                >
                  Add Option
                </Button>
              </Box>
            )}
            
            {question.type === 'LINEAR_SCALE' && (
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <TextField
                    select
                    label="Min"
                    value={question.minValue || 1}
                    onChange={(e) => handleChange('minValue', parseInt(e.target.value))}
                    sx={{ width: 100, mr: 2 }}
                  >
                    {[0, 1].map((num) => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </TextField>
                  
                  <Typography>to</Typography>
                  
                  <TextField
                    select
                    label="Max"
                    value={question.maxValue || 5}
                    onChange={(e) => handleChange('maxValue', parseInt(e.target.value))}
                    sx={{ width: 100, ml: 2 }}
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </TextField>
                </Box>
                
                <TextField
                  label="Min label (optional)"
                  fullWidth
                  value={question.minLabel || ''}
                  onChange={(e) => handleChange('minLabel', e.target.value)}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  label="Max label (optional)"
                  fullWidth
                  value={question.maxLabel || ''}
                  onChange={(e) => handleChange('maxLabel', e.target.value)}
                />
              </Box>
            )}
            
            <Box display="flex" justifyContent="space-between" mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={question.required}
                    onChange={(e) => handleChange('required', e.target.checked)}
                  />
                }
                label="Required"
              />
              
              <Box>
                <IconButton onClick={() => onDuplicate()} size="small">
                  <FileCopy />
                </IconButton>
                <IconButton onClick={() => onDelete()} size="small">
                  <Delete />
                </IconButton>
                <Button onClick={() => setEditing(false)}>Done</Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">
                {question.text || "Untitled Question"}
                {question.required && <span style={{ color: 'red' }}>*</span>}
              </Typography>
              
              <IconButton onClick={() => setEditing(true)} size="small">
                <Edit />
              </IconButton>
            </Box>
            
            {question.description && (
              <Typography variant="caption" color="textSecondary" gutterBottom>
                {question.description}
              </Typography>
            )}
            
            <Box mt={2} mb={1}>
              <QuestionComponent 
                question={question} 
                previewMode 
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// 3. MAIN APPLICATION PAGES ======================================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/forms/new" element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          } />
          <Route path="/forms/:formId/edit" element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          } />
          <Route path="/forms/:formId/view" element={<ViewForm />} />
          <Route path="/responses/:formId" element={
            <ProtectedRoute>
              <FormResponses />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Additional component implementations...

export default App;
