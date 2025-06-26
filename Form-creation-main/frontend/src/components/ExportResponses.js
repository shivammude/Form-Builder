import React from 'react';
import axios from 'axios';
import { exportToExcel } from '../utils';

const ExportResponses = ({ formId }) => {
  const handleExport = async () => {
    // Fetch both form and responses
    const response = await axios.get(`/api/responses/export/${formId}`);
    const { form, responses } = response.data;

    // Build a mapping from field ID to label
    const fieldMap = {};
    (form.fields || []).forEach(field => {
      fieldMap[field.id] = field.label;
    });

    // Prepare data for export: use question labels as keys
    const exportData = (responses || []).map(r => {
      const row = {};
      Object.entries(r.data || {}).forEach(([fieldId, value]) => {
        row[fieldMap[fieldId] || fieldId] = value;
      });
      // Optionally add submitter info, date, etc.
      if (r.email) row['Submitter'] = r.email;
      if (r.createdAt) row['Submitted At'] = r.createdAt;
      return row;
    });

    exportToExcel(exportData, form.title || `responses_${formId}`);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      Export Responses
    </button>
  );
};

export default ExportResponses;
