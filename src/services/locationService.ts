import { commonHeaders } from "@/lib/commonHeaders";
import { LocationData } from "@/types/map";

const locationCache = new Map<string, LocationData>();

const getLocationData = async (
    latitude: number,
    longitude: number,
): Promise<{location: LocationData}> => {
	
	const key = `${latitude},${longitude}`;

	// Check cache first
	const cached = locationCache.get(key);
	if (cached) return { location: cached };

	const res = await fetch("/api/geolocate", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...commonHeaders()
        },
        body: JSON.stringify({ lat: latitude, lng: longitude }),
    });

	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Failed to fetch location: ${error}`);
	}

	const locationData =  await res.json();
	locationCache.set(key, locationData); // store in cache

	console.log(locationData, "locationData")

    return { location: locationData };
};
  
export { getLocationData, locationCache };
  