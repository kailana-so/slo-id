import { IdentificationFormField } from "@/types/form";
import { Note } from "@/types/note";
import { identificationFormSchema } from "./forms/identification/IdentificationFormSchema";
import { renderValue } from "./NoteDetails.utils";
import DWCIdDetails from "./DWCIdDetails";
import SuggestionChips from "./SuggestionChips";
import { Suggestion } from "@/types/suggestions";


interface NoteDetails {
  note: Note;
  handleEditNote: (noteId: string) => Promise<void>;
  handleUpdateNote: (noteId: string, updates: Record<string, string | boolean>, isComplete: boolean) => Promise<void>;
  handleGenerateSuggestions: (noteId: string, noteData: Note) => Promise<void>;
  suggestionsLoading: boolean;
  isActiveDraft: boolean;
  hasActiveDraft: boolean;
}

const HIDDEN_FIELDS = ["id", "imageId"];

export function NoteDetails({ 
	note, 
	handleEditNote,
	handleUpdateNote,
	handleGenerateSuggestions,
	suggestionsLoading,
	isActiveDraft,
	hasActiveDraft
}: NoteDetails) {
	const typeSchema = identificationFormSchema[note.type];
	const observedFields = typeSchema.filter(
		(field: IdentificationFormField) =>
		note[field.name] !== undefined &&
		note[field.name] !== null &&
		!HIDDEN_FIELDS.includes(field.name)
	);

	return (
		<div className="space-y-2">
			<div>
				<div className="pt-4 space-y-2">
					<h4> Observed</h4>
					{note?.type &&
						observedFields.map((field: IdentificationFormField) => (
							<p key={field.name}>
								<strong>{field.label}:</strong>{" "}
								{note[field.name] && renderValue(field.name, note[field.name])}
							</p>
						))}
			{/* Suggestions */}
			<SuggestionChips 
				suggestions={note.suggestions as Suggestion[] | undefined}
				getSuggestions={() => handleGenerateSuggestions(note.id, note)}
				suggestionsLoading={suggestionsLoading}
			/>
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
  