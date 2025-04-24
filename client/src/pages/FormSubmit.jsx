// client/src/pages/FormSubmit.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import SignatureCanvas from 'react-signature-canvas';
import { submitResponse } from '../api/responseApi';

function FormSubmit() {
  const { formId, shareLink } = useParams();
  const { form, fetchFormByShareLink, loading, error } = useFormStore();
  const sigCanvas = useRef(null);
  const [responses, setResponses] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (shareLink) {
      fetchFormByShareLink(shareLink);
    }
  }, [shareLink, fetchFormByShareLink]);

  const handleChange = (e) => {
    setResponses({ ...responses, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: null });
  };

  const handleSignature = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();
      setResponses({ ...responses, signature: signatureData });
      setValidationErrors({ ...validationErrors, signature: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    form.fields.forEach((field) => {
      if (field.required) {
        const value = responses[field.label] || responses[field.type];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.label] = `${field.label} is required`;
        } else if (field.type === 'signature' && !sigCanvas.current?.toDataURL().includes('data:image/png')) {
          errors[field.label] = 'Signature is required';
        }
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      const responseData = {
        formId: form._id || formId,
        responses,
        shareLink: shareLink || undefined,
      };
      await submitResponse(responseData);
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit the form. Please try again.');
    }
  };

  if (loading) return <p className="p-6 text-gray-600 text-center">Loading form...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">Error: {error}</p>;
  if (!form) return <p className="p-6 text-gray-600 text-center">Form not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{form.title}</h1>
      {submitSuccess ? (
        <p className="p-4 bg-green-100 text-green-700 rounded-lg text-center">
          Thank you! Your response has been submitted successfully.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
          {form.fields.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'signature' ? (
                <>
                  <SignatureCanvas
                    ref={sigCanvas}
                    onEnd={handleSignature}
                    canvasProps={{ className: 'w-full h-32 border border-gray-300 rounded-lg' }}
                  />
                  {validationErrors[field.label] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[field.label]}</p>
                  )}
                </>
              ) : field.type === 'textarea' || field.type === 'address' ? (
                <>
                  <textarea
                    name={field.label}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-150"
                    required={field.required}
                  />
                  {validationErrors[field.label] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[field.label]}</p>
                  )}
                </>
              ) : field.type === 'select' ? (
                <>
                  <select
                    name={field.label}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-150"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {validationErrors[field.label] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[field.label]}</p>
                  )}
                </>
              ) : (
                <>
                  <input
                    type={field.type}
                    name={field.label}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-150"
                    required={field.required}
                  />
                  {validationErrors[field.label] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[field.label]}</p>
                  )}
                </>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default FormSubmit;