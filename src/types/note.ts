import { identificationFormSchema } from "@/components/forms/identification/IdentificationFormSchema";
import { EnvironmentalData } from "./environment";
import { LocationData } from "./map";

export type FieldType = "text" | "select" | "checkbox" | "color-buttons";

export interface OptionField {
  name: string;
  hex?: string;
}

export interface IdentificationFormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  conditional?: string;
  options?: OptionField[];
}

export type FormType = keyof typeof identificationFormSchema;

export type FieldNames<T extends FormType> =
  (typeof identificationFormSchema)[T][number]["name"];

export type NoteBase = {
    id: string;
    type: FormType;
    name?: string;
    createdAt?: number;
    updatedAt?: number;
};

export type NoteByType<T extends FormType> = NoteBase & {
    [K in FieldNames<T>]?: string | boolean;
};

export type Note =
    | NoteByType<"insect">
    | NoteByType<"plant">
    | NoteByType<"reptile">
    | NoteByType<"bird">
    | NoteByType<"mineral">;

export type UploadImage = {
	name: string;
	type: string;
	content: string; 
}

export type UploadPayload = {
	thumbnailImageFile: UploadImage;
	fullImageFile: UploadImage;
}
export type FormDataValue = string | boolean | number | File | UploadPayload | EnvironmentalData | LocationData ;

export type FormData = Record<string, FormDataValue>;
    
  