import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Snackbar } from '@mui/material';

const ViewForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [answers, setAnswers] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      const response = await axios.get(`/api/forms/${formId}`);
      setForm(response.data);
    };
    fetchForm();
  }, [formId]);

  useEffect(() => {
    const fetchResponses = async () => {
      const response = await axios.get(`/api/responses/${formId}`);
      setResponses(response.data);
    };
    fetchResponses();
  }, [formId]);

  if (!form) return <div>Loading...</div>;

  const handleInputChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('/api/responses', {
        formId,
        data: answers,
        createdAt: new Date().toISOString(),
        email: user ? user.username : 'Anonymous',
      });
      setSuccess(true);
      setAnswers({});
    } catch (err) {
      setError('Failed to submit response.');
    }
  };

  const handleClear = () => {
    setAnswers({});
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {form.fields.map((field) => (
            <div key={field.id} className="mb-2">
              <label className="block text-gray-700">{field.label}</label>
              {/* Render field based on type */}
              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="border rounded w-full"
                  value={answers[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  className="border rounded w-full"
                  value={answers[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}
              {field.type === 'radio' && (
                <div>
                  {(field.options || []).map((option, idx) => (
                    <label key={idx} style={{ display: 'block' }}>
                      <input
                        type="radio"
                        name={field.id}
                        value={option}
                        checked={answers[field.id] === option}
                        onChange={() => handleInputChange(field.id, option)}
                        required={field.required}
                      /> {option}
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'checkbox' && (
                <div>
                  {(field.options || []).map((option, idx) => (
                    <label key={idx} style={{ display: 'block' }}>
                      <input
                        type="checkbox"
                        name={field.id}
                        value={option}
                        checked={Array.isArray(answers[field.id]) ? answers[field.id].includes(option) : false}
                        onChange={e => {
                          let newArr = Array.isArray(answers[field.id]) ? [...answers[field.id]] : [];
                          if (e.target.checked) {
                            newArr.push(option);
                          } else {
                            newArr = newArr.filter(o => o !== option);
                          }
                          handleInputChange(field.id, newArr);
                        }}
                      /> {option}
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'select' && (
                <select
                  className="border rounded w-full"
                  value={answers[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {(field.options || []).map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {field.type === 'date' && (
                <input
                  type="date"
                  className="border rounded w-full"
                  value={answers[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>Submit</Button>
        <Button type="button" variant="outlined" color="secondary" onClick={handleClear}>Clear</Button>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="Response submitted!"
      />
    </div>
  );
};

export default ViewForm;
