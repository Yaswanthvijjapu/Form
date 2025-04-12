// client/src/pages/FormSubmit.jsx (Skeleton)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import SignatureCanvas from 'react-signature-canvas';

function FormSubmit() {
  const { id } = useParams();
  const { fetchFormById, form, loading, error } = useFormStore();
  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetchFormById(id);
  }, [id, fetchFormById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit responses to backend
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!form) return <p>Form not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-800">{form.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4">
            {/* Render interactive fields */}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormSubmit;