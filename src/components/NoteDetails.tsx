import { format } from "date-fns";
import { IdentificationFormField } from "@/types/form";
import { Note } from "@/types/sighting";
// import { getDistanceFromLatLonInKm } from "@/utils/helpers";
import CloseIcon from '@mui/icons-material/Close';
import { identificationFormSchema } from "./forms/identification/IdentificationFormSchema";
import { fetchLocationFromCoords } from "@/services/locationService";
import { useEffect, useState } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Alert } from "@mui/material";

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
	
	const [location, setLocation] = useState<{ city: string; state: string } | null>(null);
	const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
	
	console.log(hasActiveDraft, "hasActiveDraft")
	const hasCoords = typeof note.latitude === "number" && typeof note.longitude === "number";
	const typeSchema = identificationFormSchema[note.type as keyof typeof identificationFormSchema];

	const orderedVisibleFields = typeSchema.filter(
		(field: IdentificationFormField) =>
		note[field.name] !== undefined &&
		note[field.name] !== null &&
		!HIDDEN_FIELDS.includes(field.name)
	);

	useEffect(() => {
		if(hasCoords) {
			setLoadingLocation(true)
			const getLocation = async () => {
				try {
					const location = await fetchLocationFromCoords(note.latitude, note.longitude);
					setLocation(location);
				} catch (error) {
					console.error("Location fetch failed:", error);
				}
				setLoadingLocation(false)
			};
			getLocation();
		}
	}, []);

	const renderLocation = () => {
		if (loadingLocation) {
			return <p>Finding location...</p>
		} else if (location) {
			return (
				<p>
					<strong>Location:</strong> {`${location.city}, ${location.state}`}
				</p>
			)
		}
	}


	const renderValue = (key: string, value: any) => {
		if (key === "createdAt") return format(new Date(value), "dd MMM yyyy");
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
				{hasCoords && renderLocation()}
			</div>
			<div className="flex items-end justify-between pt-4">
				<CloseIcon onClick={handleClose}/>
				{hasActiveDraft ? (
					<div className="m-1">
						<sub className="badge-item">1 active ID limit</sub>
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
  