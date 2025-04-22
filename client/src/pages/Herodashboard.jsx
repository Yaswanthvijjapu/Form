// client/src/pages/Herodashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import useAuthStore from '../store/useAuthStore'; // Add this import

function Herodashboard() {
  const { forms, fetchForms, loading, error } = useFormStore();
  const navigate = useNavigate();
  const { token } = useAuthStore.getState(); // Use the imported store

  useEffect(() => {
    if (token) fetchForms(token);
  }, [token]);

  if (loading) return <p className="p-6 text-gray-600">Loading forms...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Your Forms</h1>
      {forms.length === 0 ? (
        <p className="text-gray-600">No forms created yet.</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li key={form._id} className="border p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{form.title}</span>
                <div>
                  <Link
                    to={`/forms/${form._id}`}
                    className="mr-4 text-blue-600 hover:underline"
                  >
                    View Form
                  </Link>
                  <Link
                    to={`/responses/${form._id}`}
                    className="text-green-600 hover:underline"
                  >
                    View Responses
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => navigate('/editor')}
        className="mt-6 w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Create New Form
      </button>
    </div>
  );
}

export default Herodashboard;