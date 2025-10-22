"use client";

import React, { useState } from "react";
import { dwcUserObservationSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { IdentificationFormField } from "@/types/form";
import { renderFieldHelper } from "@/components/forms/identification/IdentificationForm.utils";
import { Note } from "@/types/note";

interface DWCIdDetailsProps {
  note: Note;
  onUpdate: (noteId: string, updates: Record<string, string | boolean>, isComplete: boolean) => Promise<void>;
}

export const DWCIdDetails: React.FC<DWCIdDetailsProps> = ({ note, onUpdate }) => {
  const [formData, setFormData] = useState<Record<string, string | boolean>>(note as Record<string, string | boolean>);
  const [isEditing, setIsEditing] = useState(false);

  // Check if all required fields are complete
  const allFieldsComplete = dwcUserObservationSchema
    .filter(field => field.type !== "textarea")
    .every(field => {
      const value = formData[field.name];
      return value !== undefined && value !== null && String(value).trim() !== '';
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleColorSelection = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(note.id, formData, allFieldsComplete);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  return (
    <div className="pt-4 space-y-2">
      <div className="flex justify-between items-center">
      <h4>DWC Identification</h4>
      <div className="flex gap-2">
        {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center btn-primary">
                <h4>Edit</h4>
            </button>
        ) : (
            <button onClick={handleSave} className="flex items-center btn-primary">
                {allFieldsComplete ? <h4>Confirm ID</h4> : <h4>Save</h4>}
            </button>
        )}
        </div>
      </div>
      {dwcUserObservationSchema.map((field: IdentificationFormField) => (
        <p key={field.name}>
          <strong>{field.label}:</strong>{" "}
          {isEditing || field.isEditable 
            ? renderFieldHelper(field, formData, handleColorSelection, handleChange)
            : (formData[field.name] || "—")
          }
        </p>
      ))}
    </div>
  );
};

export default DWCIdDetails;

