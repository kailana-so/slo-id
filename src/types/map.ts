export interface MapPin {
    name: string; 
    type: string
    latitude: number;
    longitude: number;
    createdAt: number;
    imageId?: string;
    thumbnailUrl?: string | undefined;
}

export type LocationData = {
    road: string;
    town: string;
    city: string;
    municipality: string;
    state: string;
    postcode: string;
    country_code: string;
    boundingbox: [string];
}