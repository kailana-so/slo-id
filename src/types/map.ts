export interface MapPin {
    name: string; 
    latitude: number;
    longitude: number;
    createdAt: number;
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