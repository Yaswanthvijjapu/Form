// client/src/pages/Herodashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useFormStore from '../store/useFormStore';

function Herodashboard() {
  const { isAuthenticated, token } = useAuthStore();
  const { forms, fetchForms, loading, error } = useFormStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.warn('Herodashboard - Unauthorized, redirecting to login');
      navigate('/login');
    } else {
      console.log('Herodashboard - Fetching forms with token:', token);
      fetchForms(token).catch((err) => console.error('Fetch error:', err));
    }
  }, [isAuthenticated, token, fetchForms, navigate]);

  console.log('Herodashboard - Rendered with forms:', forms, 'loading:', loading, 'error:', error);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Your Forms</h1>
      {loading && <p className="text-gray-600">Loading forms...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && forms.length === 0 ? (
        <p className="text-gray-600">No forms created yet.</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li key={form._id} className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold">{form.title}</h2>
              <button
                onClick={() => navigate(`/forms/${form._id}`)}
                className="text-blue-600 hover:underline"
              >
                View Form
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => navigate('/editor')}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Create New Form
      </button>
    </div>
  );
}

export default Herodashboard;