import { IdentificationFormField } from "@/types/form";
import { Note } from "@/types/note";
import { identificationFormSchema, dwcUserObservationSchema } from "./forms/identification/IdentificationFormSchema";
import { renderValue } from "./NoteDetails.utils";
import { format } from "date-fns";
import { sentenceCase } from "@/utils/helpers";

interface IdentificationDetailsProps {
  note: Note;
  thumbnailUrl?: string;
}

const HIDDEN_FIELDS = ["id", "imageId"];

export const IdentificationDetails: React.FC<IdentificationDetailsProps> = ({ note, thumbnailUrl }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">   
        <section 
          className="aligned content-center"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              width={200}
              height={200}
              alt={`picture of ${note.name}`}
              className="object-cover rounded-sm pr-4" 
            />
          ) : (
            <img
              src={note.type === "insect" ? "/imgs/slo-id2.png" : "/imgs/slo-id1.png"}
              width={200}
              height={200}
              alt="placeholder"
              className="object-cover rounded-sm pr-4" 
            />
          )}
        </section>
        <div>
          <div className='badge-item unselected flex items-center gap-2'>
            {/* <DrawIcon fontSize="small" /> */}
            <h4>{`${sentenceCase(note.type)}`}</h4>
          </div>
        </div>
      </div>
      
      {/* Render DWC identification fields */}
      <div className="pt-4 space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h4>Identified:</h4>
          <p>
            {note.updatedAt ? format(note.updatedAt, "dd MMM yyyy hh:mm a") : "No Date"}
          </p>
        </div>
        {dwcUserObservationSchema
          .filter((field: IdentificationFormField) => 
            note[field.name] !== undefined && 
            note[field.name] !== null &&
            String(note[field.name]).trim() !== ''
          )
          .map((field: IdentificationFormField) => (
            <p key={field.name}>
              <strong>{field.label}:</strong> {renderValue(field.name, note[field.name])}
            </p>
          ))
        }
      </div>
      
      {/* Render observed fields */}
      <div className="pt-4 space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h4>Observed:</h4> 
          <p>
            {note.createdAt ? format(note.createdAt, "dd MMM yyyy hh:mm a") : "No Date"}
          </p>
        </div>
        {note?.type && identificationFormSchema[note.type]
          .filter((field: IdentificationFormField) => 
            note[field.name] !== undefined && 
            note[field.name] !== null &&
            !HIDDEN_FIELDS.includes(field.name)
          )
          .map((field: IdentificationFormField) => (
            <p key={field.name}>
              <strong>{field.label}:</strong> {renderValue(field.name, note[field.name])}
            </p>
          ))
        }
      </div>
    </div>
  );
};

export default IdentificationDetails;

