// client/src/pages/Herodashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useFormStore from '../store/useFormStore';

function Herodashboard() {
  const { user, token, logout } = useAuthStore();
  const { forms, fetchForms, deleteForm, loading, error } = useFormStore();

  useEffect(() => {
    if (token) {
      fetchForms(token);
    }
  }, [token, fetchForms]);

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      await deleteForm(formId, token);
    }
  };

  const handleShare = (shareLink) => {
    navigator.clipboard.writeText(`${window.location.origin}/form-submit/share/${shareLink}`);
    alert('Link copied to clipboard!');
  };

  if (loading) return <p className="p-6 text-gray-600 text-center">Loading forms...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.email || 'User'}!
        </h1>
        <div className="space-x-4">
          <Link
            to="/editor"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
          >
            Create New Form
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      {forms.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No forms created yet. Start by creating a new form!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-200 border border-gray-200"
            >
              <div className="mb-4">
                <Link
                  to={`/forms/${form._id}`}
                  className="text-xl font-semibold text-purple-600 hover:text-purple-800 transition duration-150"
                >
                  {form.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Link
                  to={`/editor/${form._id}`}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Edit
                </Link>
                <Link
                  to={`/responses/${form._id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Responses
                </Link>
                <button
                  onClick={() => handleShare(form.shareLink)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Share
                </button>
                <button
                  onClick={() => handleDelete(form._id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Herodashboard;