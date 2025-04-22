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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">{form.title}</h1>
      <p>Share Link: {form.shareLink}</p>
      <h2 className="text-lg font-medium mt-4 mb-2">Fields:</h2>
      <ul>
        {form.fields.map((field, index) => (
          <li key={index} className="mb-2">
            {field.label} ({field.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewForm;