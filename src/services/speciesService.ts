import { SpeciesOccurrence, ALAResponse } from '@/types/species';

const getNearbySpecies = async (
  latitude: number,
  longitude: number,
  radius: number = 2,
  pageSize: number = 20
): Promise<SpeciesOccurrence[]> => {
  if (!latitude || !longitude || !radius) {
    throw new Error('Invalid coordinates or radius');
  }

  const url = `${process.env.ALA_OCCURANCE_API}search?q=*&lat=${latitude}&lon=${longitude}&radius=${radius}&pageSize=${pageSize}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }

  const data: ALAResponse = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error('API returned an error status');
  }

  // Sort species with images to the top
  const sortedSpecies = data.occurrences.sort((a, b) => {
    const aHasImage = !!a.thumbnailUrl;
    const bHasImage = !!b.thumbnailUrl;
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    return 0;
  });

  console.log(`Found ${sortedSpecies.length} species within ${radius}km`);
  return sortedSpecies;
};

export { getNearbySpecies }; 