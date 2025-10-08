import { IdentificationFormField } from "@/types/form";
import { Note } from "@/types/note";
import CloseIcon from '@mui/icons-material/Close';
import { dwcUserObservationSchema, identificationFormSchema } from "./forms/identification/IdentificationFormSchema";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { renderFieldHelper } from "@/components/forms/identification/IdentificationForm.utils"
import { renderValue } from "./NoteDetails.utils";
import SaveAltIcon from '@mui/icons-material/SaveAlt';


interface NoteDetails {
  note: Note;
  handleClose: () => void;
  handleIdentify: (noteId: string) => Promise<void>;
  handleEditNote: (noteId: string) => Promise<void>;
  isActiveDraft: boolean;
  hasActiveDraft: boolean;
}

const HIDDEN_FIELDS = ["id", "imageId"];

export function NoteDetails({ 
	note, 
	handleClose, 
	handleIdentify, 
	handleEditNote,
	isActiveDraft,
	hasActiveDraft
}: NoteDetails) {

	const handleUpdateFeild = (name: string, value: string) => {
		console.log(name, value)
	}
	console.log(note)
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

				</div>
				<div className="pt-4 space-y-2">
					{isActiveDraft && <h4>Identification</h4>}
					{isActiveDraft && (
						dwcUserObservationSchema.map((field: IdentificationFormField) => (
							<p key={field.name}>
								<strong>{field.label}:</strong>{" "}
								{renderFieldHelper(field, note, handleUpdateFeild)}
							</p>
						)))}
				</div>
			</div>
			<div className="flex items-end justify-between pt-4">
				<CloseIcon onClick={handleClose}/>
				{isActiveDraft && (
					<button onClick={() => handleIdentify(note.id)} className="ml-auto">
						<div className="flex items-end disabled">
							<h4>Save</h4>
							<div className="ml-4">
								<SaveAltIcon></SaveAltIcon>
							</div>
						</div>
					</button>
				)}
				{!hasActiveDraft && (
					<button onClick={() => handleEditNote(note.id)} className="ml-auto">
						<div className="flex items-end">
							<h4>Edit</h4>
							<div className="ml-4">
								<NavigateNextIcon></NavigateNextIcon>
							</div>
						</div>
					</button>
				)}
			</div>
		</div>
	);
}
  