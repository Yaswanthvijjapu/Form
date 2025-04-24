// client/src/pages/ViewResponses.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import useAuthStore from '../store/useAuthStore';
import { exportResponses } from '../api/responseApi';

function ViewResponses() {
  const { formId } = useParams();
  const { responses, fetchResponses, loading, error } = useFormStore();

  useEffect(() => {
    if (formId) fetchResponses(formId);
  }, [formId, fetchResponses]);

  const handleExportCsv = async () => {
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
      console.error('Export CSV error:', err);
      alert('Failed to export responses. Please try again.');
    }
  };

  const handleExportPdf = async () => {
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/responses/export-pdf/${formId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form_${formId}_responses.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('Failed to export responses as PDF. Please try again.');
    }
  };

  if (loading) return <p className="p-6 text-gray-600 text-center">Loading responses...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">Error: {error}</p>;
  if (!responses || responses.length === 0)
    return <p className="p-6 text-gray-600 text-center">No responses found for this form.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Responses for Form</h1>
        <div className="space-x-4">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Export to CSV
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
          >
            Export to PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Submitted At
              </th>
              {responses[0].answers.map((answer, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {answer.fieldId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {responses.map((response, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition duration-150">
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