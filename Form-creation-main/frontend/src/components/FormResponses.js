import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FormResponses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [responsesRes, formRes] = await Promise.all([
        axios.get(`/api/responses/${formId}`),
        axios.get(`/api/forms/${formId}`)
      ]);
      setResponses(responsesRes.data);
      setForm(formRes.data);
    };
    fetchData();
  }, [formId]);

  if (!form) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 24 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
          startIcon={<ArrowBackIcon />}
        >
          Return to Dashboard
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Responses for: {form.title}</h1>
      {responses.length > 0 ? (
        responses.map((response) => (
          <div key={response.id} className="border p-4 mb-2 rounded">
            <p><strong>Submitted by:</strong> {response.email || 'Anonymous'}</p>
            <p>Response ID: {response.id}</p>
            <p>Submitted at: {response.createdAt}</p>
            <div style={{ marginTop: 8 }}>
              {form.fields.map(field => (
                <div key={field.id} style={{ marginBottom: 4 }}>
                  <strong>{field.label}:</strong> {response.data && response.data[field.id] !== undefined ? response.data[field.id] : <em>Not answered</em>}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No responses yet.</p>
      )}
    </div>
  );
};

export default FormResponses;
