// client/src/pages/FormEditor.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useAuthStore from '../store/useAuthStore';
import useFormStore from '../store/useFormStore';

const fieldTypes = [
  { id: 'text', label: 'Text' },
  { id: 'email', label: 'Email' },
  { id: 'number', label: 'Number' },
  { id: 'textarea', label: 'Textarea' },
  { id: 'select', label: 'Dropdown' },
  { id: 'radio', label: 'Radio' },
  { id: 'checkbox', label: 'Checkbox' },
];

function FormEditor() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const { token } = useAuthStore();
  const { createForm, error, loading } = useFormStore();
  const navigate = useNavigate();

  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;
    console.log('Drag ended:', { source, destination });

    if (!destination) return;

    if (source.droppableId === 'fieldTypes' && destination.droppableId === 'formFields') {
      const newField = {
        id: `${fields.length}-${Date.now()}`,
        type: fieldTypes[source.index].id,
        label: `${fieldTypes[source.index].label} Field`,
        required: false,
        options:
          fieldTypes[source.index].id === 'select' || fieldTypes[source.index].id === 'radio'
            ? ['Option 1', 'Option 2']
            : [],
      };
      console.log('Adding field:', newField);
      setFields((prevFields) => {
        const newFields = [...prevFields];
        newFields.splice(destination.index, 0, newField);
        return newFields;
      });
    } else if (source.droppableId === 'formFields' && destination.droppableId === 'formFields') {
      setFields((prevFields) => {
        const newFields = [...prevFields];
        const [movedField] = newFields.splice(source.index, 1);
        newFields.splice(destination.index, 0, movedField);
        return newFields;
      });
    }
  }, [fields]);

  const updateField = (id, key, value) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, [key]: value } : field)));
  };

  const updateOptions = (id, options) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, options } : field)));
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

  const renderFieldPreview = (field) => {
    console.log('Rendering preview for:', field);
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        );
      case 'email':
        return (
          <input
            type="email"
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.label}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 h-24"
          />
        );
      case 'select':
        return (
          <select
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          >
            <option value="">{field.label}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  disabled
                  className="h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              disabled
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">{field.label}</label>
          </div>
        );
      default:
        return <p className="text-red-500">Unknown field type</p>;
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
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 bg-gray-200 rounded-md text-center cursor-move transition-all duration-200 ${
                          snapshot.isDragging
                            ? 'shadow-lg scale-105 opacity-80 bg-indigo-100 border-2 border-indigo-500'
                            : 'shadow-sm hover:bg-gray-300'
                        }`}
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
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] p-4 border border-dashed border-gray-300 rounded-md space-y-6 transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-green-50 border-green-400' : ''
                  }`}
                >
                  {fields.length === 0 && (
                    <p className="text-gray-500 text-center">Drag field types here to add them</p>
                  )}
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gray-50 border rounded-md p-4 flex space-x-4 items-start transition-all duration-200 ${
                            snapshot.isDragging
                              ? 'shadow-xl scale-102 opacity-75 bg-indigo-50 border-2 border-indigo-600'
                              : 'shadow-md hover:shadow-lg'
                          }`}
                        >
                          {/* Field Preview */}
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label}{' '}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {renderFieldPreview(field)}
                          </div>

                          {/* Field Controls */}
                          <div className="w-1/3 space-y-2">
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, 'label', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                              placeholder="Field label"
                            />
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, 'type', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Dropdown</option>
                              <option value="radio">Radio</option>
                              <option value="checkbox">Checkbox</option>
                            </select>
                            {(field.type === 'select' || field.type === 'radio') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Options (comma-separated)
                                </label>
                                <input
                                  type="text"
                                  value={field.options.join(', ')}
                                  onChange={(e) =>
                                    updateOptions(field.id, e.target.value.split(', '))
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  placeholder="e.g., Option 1, Option 2"
                                />
                              </div>
                            )}
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