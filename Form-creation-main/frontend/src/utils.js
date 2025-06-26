import * as XLSX from 'xlsx';

export const fieldTypes = [
  {
    type: 'text',
    name: 'Text Input',
    icon: 'fa-font',
    defaultConfig: {
      label: 'Text Input',
      placeholder: 'Enter text here',
      required: false
    }
  },
  {
    type: 'textarea',
    name: 'Text Area',
    icon: 'fa-align-left',
    defaultConfig: {
      label: 'Text Area',
      placeholder: 'Enter longer text here',
      required: false
    }
  },
  {
    type: 'radio',
    name: 'Radio Buttons',
    icon: 'fa-dot-circle',
    defaultConfig: {
      label: 'Choose one',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false
    }
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'fa-check-square',
    defaultConfig: {
      label: 'Checkbox',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false
    }
  },
  {
    type: 'select',
    name: 'Dropdown',
    icon: 'fa-caret-down',
    defaultConfig: {
      label: 'Select an option',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false
    }
  },
  {
    type: 'date',
    name: 'Date Picker',
    icon: 'fa-calendar',
    defaultConfig: {
      label: 'Select date',
      required: false
    }
  }
];

export const getFieldComponent = (field, value, onChange, preview = false) => {
  switch (field.type) {
    case 'text':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={preview}
          />
        </div>
      );
    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={field.placeholder}
            rows={3}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={preview}
          />
        </div>
      );
    case 'radio':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {field.options.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${i}`}
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange(option)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  required={field.required && i === 0}
                  disabled={preview}
                />
                <label htmlFor={`${field.id}-${i}`} className="ml-2 block text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    case 'checkbox':
      return (
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={preview}
            />
            <label htmlFor={field.id} className="ml-2 block text-sm text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        </div>
      );
    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={preview}
          >
            <option value="">Select an option</option>
            {field.options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    case 'date':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={preview}
          />
        </div>
      );
    default:
      return null;
  }
};

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
