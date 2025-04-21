// client/src/pages/FormSubmit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import SignatureCanvas from 'react-signature-canvas';

function FormSubmit() {
  const { id } = useParams();
  const { form, fetchFormById, loading, error } = useFormStore();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [sigCanvas, setSigCanvas] = useState(null);

  useEffect(() => {
    console.log('FormSubmit - Fetching form with ID:', id);
    fetchFormById(id); // No token, since /api/forms/:id is public
  }, [id, fetchFormById]);

  const handleInputChange = (fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const missing = form?.fields?.filter(
        (f) => f.required && !responses[f.label]
      );
      if (missing?.length) {
        alert(`Please fill required fields: ${missing.map((f) => f.label).join(', ')}`);
        return;
      }
      // Handle signature
      if (sigCanvas && responses.signature) {
        responses.signature = sigCanvas.toDataURL();
      }
      console.log('Submitting responses:', responses);
      // Placeholder for /api/responses
      alert('Form submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const renderField = (field) => {
    const { type, label, required, options } = field;
    switch (type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'url':
        return (
          <input
            type={type}
            placeholder={label}
            required={required}
            onChange={(e) => handleInputChange(label, e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-600"
          />
        );
      case 'textarea':
      case 'address':
        return (
          <textarea
            placeholder={label}
            required={required}
            onChange={(e) => handleInputChange(label, e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-600 h-24"
          />
        );
      case 'select':
        return (
          <select
            required={required}
            onChange={(e) => handleInputChange(label, e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-600"
          >
            <option value="">{label}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={label}
                  value={opt}
                  required={required}
                  onChange={(e) => handleInputChange(label, e.target.value)}
                  className="h-5 w-5 text-purple-600"
                />
                <label className="ml-3 text-gray-700">{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              required={required}
              onChange={(e) => handleInputChange(label, e.target.checked)}
              className="h-5 w-5 text-purple-600 rounded"
            />
            <label className="ml-3 text-gray-700">{label}</label>
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            required={required}
            onChange={(e) => handleInputChange(label, e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-600"
          />
        );
      case 'time':
        return (
          <input
            type="time"
            required={required}
            onChange={(e) => handleInputChange(label, e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-600"
          />
        );
      case 'file':
        return (
          <input
            type="file"
            required={required}
            onChange={(e) => handleInputChange(label, e.target.files[0])}
            className="w-full px-3 py-2 border-b border-gray-300"
          />
        );
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(label, star)}
                className={`h-5 w-5 ${responses[label] >= star ? 'text-yellow-400' : 'text-gray-400'}`}
              >
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        );
      case 'signature':
        return (
          <div className="border border-gray-300 rounded-md">
            <SignatureCanvas
              ref={(ref) => setSigCanvas(ref)}
              canvasProps={{ width: 300, height: 150, className: 'border-b border-gray-300' }}
              onEnd={() => handleInputChange(label, true)}
            />
            <button
              type="button"
              onClick={() => {
                sigCanvas?.clear();
                handleInputChange(label, null);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Clear Signature
            </button>
          </div>
        );
      default:
        return <p className="text-red-500">Unknown field type</p>;
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading form...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!form) return <p className="p-6 text-gray-600">Form not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{form.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2">{renderField(field)}</div>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormSubmit;