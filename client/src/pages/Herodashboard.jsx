// client/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useFormStore from '../store/useFormStore';

function Herodashboard() {
  const { token } = useAuthStore();
  const { forms, fetchForms, loading, error } = useFormStore();

  useEffect(() => {
    if (token) {
      fetchForms(token);
    }
  }, [token, fetchForms]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Link
        to="/editor"
        className="inline-block mb-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
      >
        Create New Form
      </Link>
      {loading && <p className="text-gray-600">Loading forms...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {forms.length === 0 && !loading && !error && (
        <p className="text-gray-600">No forms created yet.</p>
      )}
      <div className="space-y-4">
        {forms.map((form) => (
          <div
            key={form._id}
            className="p-4 border rounded-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{form.title}</h2>
              <p className="text-sm text-gray-600">{form.fields.length} fields</p>
            </div>
            <Link
              to={`/submit/${form._id}`}
              className="text-indigo-600 hover:underline"
            >
              View Form
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Herodashboard;