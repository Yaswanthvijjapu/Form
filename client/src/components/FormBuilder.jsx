import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useFormStore from "../store/useFormStore";

const FormBuilder = () => {
    const { fields, setFields } = useFormStore();

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newFields = [...fields];
        const [movedField] = newFields.splice(result.source.index, 1);
        newFields.splice(result.destination.index, 0, movedField);
        setFields(newFields);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border rounded">
                                        <input type={field.type} placeholder={field.label} className="w-full p-2 border" />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default FormBuilder;
