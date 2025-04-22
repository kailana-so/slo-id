export interface Note {
    id: string;
    name?: string; // Optional since not all notes might have it
    createdAt?: number;
    updatedAt?: number;
    type: string;

    [key: string]: any; // Allows any additional keys
}

export interface MapPin {
    name: string; 
    latitude: number;
    longitude: number;
    createdAt: number;
}





