import { IdentificationFormField } from "@/types/form";
import { Note } from "@/types/note";
import { identificationFormSchema } from "./forms/identification/IdentificationFormSchema";
import { renderValue } from "./NoteDetails.utils";
import DWCIdDetails from "./DWCIdDetails";

interface NoteDetails {
  note: Note;
  handleEditNote: (noteId: string) => Promise<void>;
  handleUpdateNote: (noteId: string, updates: Record<string, string | boolean>, isComplete: boolean) => Promise<void>;
  isActiveDraft: boolean;
  hasActiveDraft: boolean;
}

const HIDDEN_FIELDS = ["id", "media", "user_id"];

export function NoteDetails({
    note,
    handleEditNote,
    handleUpdateNote,
    isActiveDraft,
    hasActiveDraft
}: NoteDetails) {
    const typeSchema = note.type ? identificationFormSchema[note.type] : [];
    const observedFields = typeSchema.filter(
        (field: IdentificationFormField) =>
            note.fields[field.name] !== undefined &&
            note.fields[field.name] !== null &&
            !HIDDEN_FIELDS.includes(field.name)
    );

    return (
        <div className="space-y-2">
            <div>
                <div className="pt-4 space-y-2">
                    <h4>Observed</h4>
                    {note?.type &&
                        observedFields.map((field: IdentificationFormField) => (
                            <p key={field.name}>
                                <strong>{field.label}:</strong>{" "}
                                {note.fields[field.name] && renderValue(field.name, note.fields[field.name])}
                            </p>
                        ))}
                </div>
                {isActiveDraft && (
                    <DWCIdDetails note={note} onUpdate={handleUpdateNote} />
                )}
            </div>
            {!hasActiveDraft && (
                <div className="pt-4 flex justify-end">
                    <button onClick={() => handleEditNote(note.id)} className="btn-primary">
                        <h4>Identify</h4>
                    </button>
                </div>
            )}
        </div>
    );
}
