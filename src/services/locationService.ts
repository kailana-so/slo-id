const locationCache = new Map<string, { city: string; state: string }>();

const fetchLocationFromCoords = async (
    latitude: string,
    longitude: string,
  ): Promise<{ city:string, state: string }> => {
	
	const key = `${latitude},${longitude}`;

	// Check cache first
	const cached = locationCache.get(key);
	if (cached) return cached;

    const params = new URLSearchParams({ lat: latitude, lng: longitude }).toString();
  
    const res = await fetch(`/api/geolocate?${params}`);
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to fetch location: ${error}`);
    }
  
    const { city, state_code } =  await res.json(); // expected { city:string, state_code: string }
	locationCache.set(key, { city, state: state_code }); // store in cache


    return { 
        city: city, 
        state: state_code
    }
};
  
export { fetchLocationFromCoords, locationCache };
  