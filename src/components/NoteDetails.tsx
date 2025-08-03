import { format } from "date-fns";
import { IdentificationFormField } from "@/types/form";
import { Note } from "@/types/note";
// import { getDistanceFromLatLonInKm } from "@/utils/helpers";
import CloseIcon from '@mui/icons-material/Close';
import { identificationFormSchema } from "./forms/identification/IdentificationFormSchema";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { isDefined } from "@/types/typeGuards";

interface NoteDetails {
  note: Note;
  handleClose: () => void;
  handleIdentify: (noteId: string) => Promise<void>;
  hasActiveDraft: boolean;
}

const HIDDEN_FIELDS = ["id", "imageId"];

export function NoteExtendedDetails({ 
	note, 
	handleClose, 
	handleIdentify, 
	hasActiveDraft,
}: NoteDetails) {

	const typeSchema = identificationFormSchema[note.type];

	const orderedVisibleFields = typeSchema.filter(
		(field: IdentificationFormField) =>
		note[field.name] !== undefined &&
		note[field.name] !== null &&
		!HIDDEN_FIELDS.includes(field.name)
	);

	const renderValue = (key: keyof Note, value: Note[keyof Note]) => {
		if (!isDefined(value)) return "";
		if (key === "createdAt" && typeof value === "number") return format(new Date(value), "dd MMM yyyy");
		if (typeof value === "boolean") return value ? "Yes" : "No";
		return String(value);
	};

	return (
		<div className="pt-4 space-y-2">
			<div className="note-divider pt-4 space-y-2">
				{orderedVisibleFields.map((field) => (
					<p key={field.name}>
					<strong>{field.label}:</strong> {renderValue(field.name, note[field.name])}
					</p>
				))}
			</div>
			<div className="flex items-end justify-between pt-4">
				<CloseIcon onClick={handleClose}/>
				{hasActiveDraft ? (
					<div className="flex items-end disabled">
						<p>One active draft at a time</p>
					</div>
				) : (
					<button onClick={() => handleIdentify(note.id)} className="ml-auto">
						<div className="flex items-end">
							<h4>Identify</h4>
							<NavigateNextIcon></NavigateNextIcon>
						</div>
					</button>
				)}
			</div>
		</div>
	);
}
  