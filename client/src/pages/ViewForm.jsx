// client/src/pages/ViewForm.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFormStore from '../store/useFormStore';

function ViewForm() {
  const { id } = useParams();
  const { form, fetchFormById, loading, error } = useFormStore();

  useEffect(() => {
    fetchFormById(id);
  }, [id, fetchFormById]);

  if (loading) return <p className="p-6 text-gray-600">Loading form...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!form) return <p className="p-6 text-gray-600">Form not found</p>;

  // Render field preview similar to FormEditor
  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'url':
        return (
          <input
            type={field.type}
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case 'textarea':
      case 'address':
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
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-4">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field.label} // Use label instead of ID for uniqueness
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
      case 'date':
      case 'time':
        return (
          <input
            type={field.type}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case 'file':
        return (
          <div className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 text-center">
            File Upload Placeholder
          </div>
        );
      default:
        return <p className="text-red-500">Unknown field type: {field.type}</p>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">{form.title}</h1>
      <div className="space-y-4">
        {/* Share Link */}
        <p className="text-gray-600">
        <strong>Shareable Link:</strong>{' '}
        <a
            href={`http://localhost:5173/form-submit/share/${form.shareLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
        >
            {form.shareLink}
        </a>
        </p>

        {/* Timestamps (if available) */}
        {form.createdAt && (
          <p className="text-gray-600">
            <strong>Created:</strong>{' '}
            {new Date(form.createdAt).toLocaleString()}
          </p>
        )}
        {form.updatedAt && (
          <p className="text-gray-600">
            <strong>Last Updated:</strong>{' '}
            {new Date(form.updatedAt).toLocaleString()}
          </p>
        )}

        {/* Fields Section */}
        <div>
          <h2 className="text-lg font-medium mb-2 text-gray-700">Form Fields</h2>
          {form.fields.length > 0 ? (
            <div className="space-y-6">
              {form.fields.map((field, index) => (
                <div key={index} className="border p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <span className="text-sm text-gray-500">{field.type}</span>
                  </div>
                  {field.options && (
                    <p className="text-sm text-gray-600 mb-2">
                      Options: {field.options.join(', ')}
                    </p>
                  )}
                  <div className="mt-2">{renderFieldPreview(field)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No fields defined for this form.</p>
          )}
        </div>

        {/* Form Preview */}
        <div>
          <h2 className="text-lg font-medium mb-2 text-gray-700">Form Preview</h2>
          <div className="p-4 border rounded-md shadow-sm bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">{form.title}</h3>
            {form.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1">{renderFieldPreview(field)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewForm;