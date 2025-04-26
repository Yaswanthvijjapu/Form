// client/src/pages/FormEditor.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'file', label: 'File Upload' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'address', label: 'Address' },
  { id: 'url', label: 'Website URL' },
  { id: 'rating', label: 'Rating' },
  { id: 'signature', label: 'Signature' },
];

function FormEditor() {
  const { formId } = useParams();
  const { token } = useAuthStore();
  const { form, fetchFormById, createForm, updateForm, loading, error } = useFormStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (formId) {
      fetchFormById(formId);
    }
  }, [formId, fetchFormById]);

  useEffect(() => {
    if (form && formId) {
      setTitle(form.title || '');
      setFields(
        form.fields.map((field) => ({
          id: `${field.label}-${Date.now()}`, // Generate a new ID for editing
          type: field.type,
          label: field.label,
          required: field.required,
          options: field.options || [],
        }))
      );
    } else {
      setTitle('');
      setFields([]);
    }
  }, [form, formId]);

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
      if (formId) {
        await updateForm(formId, formData, token);
      } else {
        await createForm(formData, token);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Form save error:', err);
    }
  };

  const renderFieldPreview = (field) => {
    return <div>Preview for {field.type}</div>; // Replace with your actual renderFieldPreview logic
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 overflow-hidden"
      style={{ height: 'calc(100vh - 80px)' }} // Adjust this based on the navbar height (e.g., 80px)
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="overflow-hidden">
          <div className="border-t-8 border-purple-600 rounded-t-lg p-4 sm:p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-purple-600 bg-transparent"
              placeholder="Untitled Form"
              required
            />
            <p className="text-sm sm:text-base text-gray-500 mt-2">Form description (optional)</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-auto">
            {fields.map((field) => (
              <div
                key={field.id}
                className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="mt-2 sm:mt-3">{renderFieldPreview(field)}</div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, 'label', e.target.value)}
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Field label"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, 'type', e.target.value)}
                      className="w-full mt-2 sm:mt-3 px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {(field.type === 'select' || field.type === 'radio') && (
                      <div className="mt-2 sm:mt-3">
                        <label className="block text-sm sm:text-base font-medium text-gray-700">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={field.options.join(', ')}
                          onChange={(e) => updateOptions(field.id, e.target.value.split(', ').filter(Boolean))}
                          className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="e.g., Option 1, Option 2"
                        />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-3">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label className="ml-2 text-sm sm:text-base text-gray-700">Required</label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="text-red-600 hover:text-red-800 text-sm sm:text-base"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
            <select
              onChange={(e) => {
                if (e.target.value) addField(e.target.value);
                e.target.value = '';
              }}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-purple-500 mb-4 sm:mb-0"
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
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-purple-400 text-sm sm:text-base"
            >
              {loading ? 'Saving...' : formId ? 'Save Changes' : 'Save Form'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm sm:text-base p-4 sm:p-6">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default FormEditor;
