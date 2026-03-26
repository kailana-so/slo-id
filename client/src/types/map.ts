export interface MapPin {
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    created_at: string;
    thumbnailUrl?: string;
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