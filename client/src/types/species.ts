export interface SpeciesOccurrence {
  uuid: string;
  scientificName: string;
  vernacularName?: string;
  phylum: string;
  classs: string;
  species?: string;
  year?: number;
  month?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  decimalLatitude: number;
  decimalLongitude: number;
}

export interface ALAResponse {
  totalRecords: number;
  occurrences: SpeciesOccurrence[];
  status: string;
} 