// src/components/FormBuilder.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fieldTypes, getFieldComponent } from '../utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formLink, setFormLink] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      ...fieldTypes.find(ft => ft.type === type).defaultConfig
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleOptionChange = (id, idx, value) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const options = [...(f.options || [])];
        options[idx] = value;
        return { ...f, options };
      }
      return f;
    }));
  };

  const handleAddOption = (id) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const options = [...(f.options || []), 'New Option'];
        return { ...f, options };
      }
      return f;
    }));
  };

  const handleRemoveOption = (id, idx) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        const options = [...(f.options || [])];
        options.splice(idx, 1);
        return { ...f, options };
      }
      return f;
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setFields(reordered);
  };

  const handleSaveForm = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/forms', {
        title,
        fields,
        userId: user?.id || 'anonymous'
      });
      // Generate the public link
      const link = `${window.location.origin}/forms/${response.data.id}/view`;
      setFormLink(link);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formLink);
      setSnackbarOpen(true);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/dashboard');
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="form-builder">
      <Button variant="outlined" color="primary" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <h2>Create New Form</h2>
      <input
        type="text"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-title-input"
      />
      <div className="field-types">
        {fieldTypes.map(type => (
          <button 
            key={type.type}
            onClick={() => handleAddField(type.type)}
          >
            Add {type.name}
          </button>
        ))}
      </div>
      <div className="form-builder-main" style={{ display: 'flex', gap: '2rem' }}>
        <div className="form-preview" style={{ flex: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {fields.length === 0 ? (
                    <div style={{ minHeight: 40, color: '#888', textAlign: 'center' }}>No fields yet. Add a question!</div>
                  ) : (
                    fields.map((field, idx) => (
                      <Draggable key={field.id} draggableId={field.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`form-field-preview${selectedFieldId === field.id ? ' selected' : ''}`}
                            style={{
                              border: selectedFieldId === field.id ? '2px solid #007bff' : '1px solid #ccc',
                              padding: '1rem',
                              marginBottom: '1rem',
                              background: snapshot.isDragging ? '#f0f8ff' : '#fff',
                              ...provided.draggableProps.style
                            }}
                            onClick={() => setSelectedFieldId(field.id)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong>{field.label}</strong>
                              <button onClick={e => { e.stopPropagation(); handleRemoveField(field.id); }} style={{ color: 'red' }}>Remove</button>
                            </div>
                            <div style={{ marginTop: '0.5rem' }}>
                              {field.type === 'checkbox' && (field.options || []).map((opt, i) => (
                                <label key={i} style={{ display: 'block' }}>
                                  <input type="checkbox" disabled /> {opt}
                                </label>
                              ))}
                              {field.type !== 'checkbox' && getFieldComponent(field, '', () => {}, true)}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="field-editor" style={{ flex: 1, minWidth: 250 }}>
          {selectedField ? (
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
              <h4>Edit Field</h4>
              <div>
                <label>Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={e => handleFieldChange(selectedField.id, 'label', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              {selectedField.placeholder !== undefined && (
                <div>
                  <label>Placeholder</label>
                  <input
                    type="text"
                    value={selectedField.placeholder}
                    onChange={e => handleFieldChange(selectedField.id, 'placeholder', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedField.required}
                    onChange={e => handleFieldChange(selectedField.id, 'required', e.target.checked)}
                  />
                  {' '}Required
                </label>
              </div>
              {(selectedField.type === 'radio' || selectedField.type === 'select' || selectedField.type === 'checkbox') && (
                <div>
                  <label>Options</label>
                  {(selectedField.options || []).map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handleOptionChange(selectedField.id, idx, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button onClick={() => handleRemoveOption(selectedField.id, idx)} style={{ marginLeft: 4 }}>x</button>
                    </div>
                  ))}
                  <button onClick={() => handleAddOption(selectedField.id)}>Add Option</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#888' }}>Select a field to edit</div>
          )}
        </div>
      </div>
      <Button 
        onClick={handleSaveForm} 
        disabled={!title || fields.length === 0}
        style={{ marginTop: 24 }}
      >
        Save Form
      </Button>
      {/* Dialog for sharing link */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Form Created!</DialogTitle>
        <DialogContent>
          <TextField
            label="Shareable Link"
            value={formLink}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLink} variant="contained">Copy Link</Button>
          <Button onClick={handleDialogClose} variant="outlined">Go to Dashboard</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied!"
      />
    </div>
  );
};

export default FormBuilder;
