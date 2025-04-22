// client/src/pages/ViewResponses.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFormStore from '../store/useFormStore';

function ViewResponses() {
  const { formId } = useParams();
  const { responses, fetchResponses, loading, error } = useFormStore();

  useEffect(() => {
    if (formId) fetchResponses(formId);
  }, [formId, fetchResponses]);

  if (loading) return <p className="p-6 text-gray-600">Loading responses...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!responses || responses.length === 0)
    return <p className="p-6 text-gray-600">No responses found for this form.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Responses for Form</h1>
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