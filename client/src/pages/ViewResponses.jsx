// client/src/pages/ViewResponses.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import useAuthStore from '../store/useAuthStore'; // Add this import
import { exportResponses } from '../api/responseApi';

function ViewResponses() {
  const { formId } = useParams();
  const { responses, fetchResponses, loading, error } = useFormStore();

  useEffect(() => {
    if (formId) fetchResponses(formId);
  }, [formId, fetchResponses]);

  // client/src/pages/ViewResponses.jsx
  const handleExport = async () => {
    try {
      const { token } = useAuthStore.getState();
      const blob = await exportResponses(formId, token);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form_${formId}_responses.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export responses. Please try again.');
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading responses...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!responses || responses.length === 0)
    return <p className="p-6 text-gray-600">No responses found for this form.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Responses for Form</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Export to CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted At
              </th>
              {responses[0].answers.map((answer, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {answer.fieldId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {responses.map((response, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(response.submittedAt).toLocaleString()}
                </td>
                {response.answers.map((answer, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewResponses;