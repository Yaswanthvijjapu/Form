// client/src/pages/FormSubmit.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import SignatureCanvas from 'react-signature-canvas';
import { submitResponse } from '../api/responseApi';

function FormSubmit() {
  const { formId, shareLink } = useParams();
  const { form, fetchFormById, fetchFormByShareLink, loading, error } = useFormStore();
  const sigCanvas = useRef(null);
  const [responses, setResponses] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (shareLink) {
      fetchFormByShareLink(shareLink);
    } else if (formId) {
      const { token } = useAuthStore.getState();
      if (token) fetchFormById(formId);
    }
  }, [formId, shareLink, fetchFormById, fetchFormByShareLink]);

  const handleChange = (e) => {
    setResponses({ ...responses, [e.target.name]: e.target.value });
  };

  const handleSignature = () => {
    if (sigCanvas.current) {
      setResponses({ ...responses, signature: sigCanvas.current.toDataURL() });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = {
        formId: form._id || formId, // Use form._id if fetched, else formId
        responses,
        shareLink: shareLink || undefined,
      };
      await submitResponse(responseData);
      setSubmitSuccess(true);
      // Optionally redirect: navigate('/thank-you'); // Uncomment to redirect
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit the form. Please try again.');
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading form...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!form) return <p className="p-6 text-gray-600">Form not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">{form.title}</h1>
      {submitSuccess ? (
        <p className="p-4 bg-green-100 text-green-700 rounded-md">
          Thank you! Your response has been submitted successfully.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'signature' ? (
                <SignatureCanvas
                  ref={sigCanvas}
                  onEnd={handleSignature}
                  canvasProps={{ className: 'w-full h-32 border border-gray-300 rounded' }}
                />
              ) : field.type === 'textarea' || field.type === 'address' ? (
                <textarea
                  name={field.label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default FormSubmit;