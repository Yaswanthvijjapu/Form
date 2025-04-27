// client/src/pages/ViewForm.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFormStore from "../store/useFormStore";

function ViewForm() {
  const { id } = useParams();
  const { form, fetchFormById, loading, error } = useFormStore();

  useEffect(() => {
    fetchFormById(id);
  }, [id, fetchFormById]);

  if (loading) return <p className="p-6 text-gray-600">Loading form...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!form) return <p className="p-6 text-gray-600">Form not found</p>;

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "phone":
      case "url":
        return (
          <input
            type={field.type}
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case "textarea":
      case "address":
        return (
          <textarea
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none h-24"
          />
        );
      case "select":
        return (
          <select
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          >
            <option value="">{field.label}</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-4">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field.id || field.label}
                  value={option}
                  disabled
                  className="h-5 w-5 text-gray-600 border-gray-300"
                />
                <label className="ml-3 text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              disabled
              className="h-5 w-5 text-gray-600 border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700">{field.label}</label>
          </div>
        );
      case "date":
      case "time":
        return (
          <input
            type={field.type}
            disabled
            className="w-full px-3 py-2 border-b border-gray-300 bg-transparent focus:outline-none"
          />
        );
      case "file":
        return (
          <div className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 text-center">
            File Upload Placeholder
          </div>
        );
      case "rating":
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        );
      case "signature":
        return (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 text-center">
            Signature Placeholder
          </div>
        );
      default:
        return <p className="text-red-500">Unknown field type: {field.type}</p>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-24 px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-2xl shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">{form.title}</h1>
        <Link
          to={`/editor/${form._id}`}
          className="text-yellow-600 hover:underline"
        >
          Edit
        </Link>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">
          <strong>Shareable Link:</strong>{" "}
          <a
            href={`http://localhost:5173/form-submit/share/${form.shareLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {form.shareLink}
          </a>
        </p>
        {form.createdAt && (
          <p className="text-gray-600">
            <strong>Created:</strong>{" "}
            {new Date(form.createdAt).toLocaleString()}
          </p>
        )}
        {form.updatedAt && (
          <p className="text-gray-600">
            <strong>Last Updated:</strong>{" "}
            {new Date(form.updatedAt).toLocaleString()}
          </p>
        )}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Form Fields
          </h2>
          {form.fields.length > 0 ? (
            <div className="space-y-6">
              {form.fields.map((field, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <span className="text-xs text-gray-500">{field.type}</span>
                  </div>
                  {field.options && (
                    <p className="text-xs text-gray-600 mb-2">
                      Options: {field.options.join(", ")}
                    </p>
                  )}
                  <div className="mt-2">{renderFieldPreview(field)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No fields defined for this form.</p>
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2 text-gray-700">
            Form Preview
          </h2>
          <div className="p-4 border rounded-md shadow-sm bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">{form.title}</h3>
            {form.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1">{renderFieldPreview(field)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewForm;
