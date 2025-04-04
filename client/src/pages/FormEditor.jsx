// client/src/pages/FormEditor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useAuthStore from '../store/useAuthStore';
import useFormStore from '../store/useFormStore';

const fieldTypes = [
  { id: 'text', label: 'Text' },
  { id: 'email', label: 'Email' },
  { id: 'number', label: 'Number' },
];

function FormEditor() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const { token } = useAuthStore();
  const { createForm, error, loading } = useFormStore();
  const navigate = useNavigate();

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === 'fieldTypes' && destination.droppableId === 'formFields') {
      const newField = {
        id: `${fields.length}-${Date.now()}`,
        type: fieldTypes[source.index].id,
        label: `${fieldTypes[source.index].label} Field`,
        required: false,
      };
      const newFields = [...fields];
      newFields.splice(destination.index, 0, newField);
      setFields(newFields);
    } else if (source.droppableId === 'formFields' && destination.droppableId === 'formFields') {
      const newFields = [...fields];
      const [movedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, movedField);
      setFields(newFields);
    }
  };

  const updateField = (id, key, value) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, [key]: value } : field)));
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || fields.length === 0) {
      alert('Please provide a title and at least one field');
      return;
    }
    try {
      const formData = {
        title,
        fields: fields.map(({ id, ...rest }) => rest),
      };
      await createForm(formData, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Form creation error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex space-x-6">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Sidebar */}
        <div className="w-1/4">
          <h2 className="text-lg font-semibold mb-4">Field Types</h2>
          <Droppable droppableId="fieldTypes" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 p-2"
              >
                {fieldTypes.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 bg-gray-200 rounded-md text-center cursor-move"
                      >
                        {field.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Form Area */}
        <div className="w-3/4">
          <h1 className="text-2xl font-bold mb-6">Create a New Form</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Form Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter form title"
                required
              />
            </div>

            <Droppable droppableId="formFields">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px] p-4 border border-dashed border-gray-300 rounded-md space-y-4"
                >
                  {fields.length === 0 && (
                    <p className="text-gray-500 text-center">Drag field types here to add them</p>
                  )}
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-gray-50 border rounded-md flex flex-col space-y-2"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Label
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, 'label', e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, 'type', e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                updateField(field.id, 'required', e.target.checked)
                              }
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Required</label>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Saving...' : 'Save Form'}
            </button>
          </form>
        </div>
      </DragDropContext>
    </div>
  );
}

export default FormEditor;