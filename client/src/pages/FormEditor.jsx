// client/src/pages/FormEditor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useFormStore from '../store/useFormStore';

const fieldTypes = [
  { id: 'text', label: 'Short Answer' },
  { id: 'email', label: 'Email' },
  { id: 'number', label: 'Number' },
  { id: 'textarea', label: 'Paragraph' },
  { id: 'select', label: 'Dropdown' },
  { id: 'radio', label: 'Multiple Choice' },
  { id: 'checkbox', label: 'Checkbox' },
];

function FormEditor() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const { token } = useAuthStore();
  const { createForm, error, loading } = useFormStore();
  const navigate = useNavigate();

  const addField = (type) => {
    const newField = {
      id: `${fields.length}-${Date.now()}`,
      type,
      label: `${fieldTypes.find((f) => f.id === type).label} Field`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, [key]: value } : field)));
  };

  const updateOptions = (id, options) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, options } : field)));
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || fields.length === 0) {
      alert('Please provide a title and at least one field');
      return;
    }
    try {
      const formData = {
        title,
        fields: fields.map(({ id, ...rest }) => rest),
      };
      await createForm(formData, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Form creation error:', err);
    }
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case 'email':
        return (
          <input
            type="email"
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none h-24"
          />
        );
      case 'select':
        return (
          <select
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          >
            <option value="">{field.label}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-4">
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  disabled
                  className="h-5 w-5 text-gray-600 border-gray-300"
                />
                <label className="ml-3 text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              disabled
              className="h-5 w-5 text-gray-600 border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700">{field.label}</label>
          </div>
        );
      default:
        return <p className="text-red-500">Unknown field type</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-sm">
      <form onSubmit={handleSubmit}>
        {/* Form Header */}
        <div className="border-t-8 border-purple-600 rounded-t-lg p-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-purple-600 bg-transparent"
            placeholder="Untitled Form"
            required
          />
          <p className="text-gray-500 mt-2">Form description (optional)</p>
        </div>

        {/* Fields */}
        <div className="p-6 space-y-6">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                {/* Field Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}{' '}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="mt-2">{renderFieldPreview(field)}</div>
                </div>

                {/* Field Controls */}
                <div className="border-t border-gray-200 pt-4">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, 'label', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Field label"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, 'type', e.target.value)}
                    className="w-full mt-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {(field.type === 'select' || field.type === 'radio') && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={field.options.join(', ')}
                        onChange={(e) => updateOptions(field.id, e.target.value.split(', '))}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="e.g., Option 1, Option 2"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Required</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Field Button */}
        <div className="p-6 flex justify-between items-center border-t border-gray-200">
          <select
            onChange={(e) => {
              if (e.target.value) addField(e.target.value);
              e.target.value = '';
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Add a field</option>
            {fieldTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400"
          >
            {loading ? 'Saving...' : 'Save Form'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm p-6">{error}</p>}
      </form>
    </div>
  );
}

export default FormEditor;