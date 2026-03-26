import { EnvironmentalData } from "./environment";
import { LocationData } from "./map";

export const MediaType = {
    PHOTO: "photo",
    VIDEO: "video",
    AUDIO: "audio",
} as const;

export type MediaType = typeof MediaType[keyof typeof MediaType];

export type MediaItem = {
    key: string;
    media_type: MediaType;
    thumbnail_key?: string;  // photos only — S3 key for the compressed thumbnail
};

export const SightingStatus = {
    SIGHTING:       "sighting",
    DRAFT:          "draft",
    IDENTIFICATION: "identification",
} as const;

export type SightingStatus = typeof SightingStatus[keyof typeof SightingStatus];

export const NoteFormType = {
    INSECT:  "insect",
    PLANT:   "plant",
    REPTILE: "reptile",
    BIRD:    "bird",
} as const;

export type FormType = typeof NoteFormType[keyof typeof NoteFormType];

export type Note = {
    id: string;
    user_id: string | null;
    type: FormType | null;
    status: SightingStatus;
    name?: string;
    media: MediaItem[];
    latitude?: number;
    longitude?: number;
    location?: LocationData;
    environment?: EnvironmentalData;
    fields: Record<string, string | boolean>;
    created_at: string;
    updated_at: string;
};

export type NoteCreate = {
    type?: FormType;
    media?: MediaItem[];
    latitude?: number;
    longitude?: number;
    location?: LocationData;
    environment?: EnvironmentalData;
};

export type NoteUpdate = {
    name?: string;
    type?: FormType;
    status?: SightingStatus;
    media?: MediaItem[];
    latitude?: number;
    longitude?: number;
    location?: LocationData;
    environment?: EnvironmentalData;
    fields?: Record<string, string | boolean>;
};

export type UploadImage = {
    name: string;
    type: string;
    content: string;
};

export type UploadPayload = {
    thumbnailImageFile: UploadImage;
    fullImageFile: UploadImage;
};

export type FormDataValue = string | boolean | number | File | UploadPayload | EnvironmentalData | LocationData;

export type FormData = Record<string, FormDataValue>;
