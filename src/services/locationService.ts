import { commonHeaders } from "@/lib/commonHeaders";
import { LocationData } from "@/types/map";
import { getLocation } from "@/utils/getLocation.client";

const locationCache = new Map<string, LocationData>();
const userLocationCache = new Map<string, {latitude: number; longitude: number; accuracy: number; timestamp: number}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

const getCurrentUserLocation = async (): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
}> => {
    const cacheKey = 'current_user_location';
    
    // Check cache first
	const cached = userLocationCache.get(cacheKey);
	if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
		console.log("Using cached user location");
		return {
			latitude: cached.latitude,
			longitude: cached.longitude,
			accuracy: cached.accuracy
		};
	}

    try {
        console.log("Fetching fresh user location...");
        const coords = await getLocation();
        
        // Cache the result
        userLocationCache.set(cacheKey, {
            ...coords,
            timestamp: Date.now()
        });
        
        console.log("User location obtained and cached:", coords);
        return coords;
    } catch (error) {
        console.error("Error getting user location:", error);
        
        // If we have a cached location that's expired, we can still use it as fallback
        const cached = userLocationCache.get(cacheKey);
        if (cached) {
            console.log("Using expired cached location as fallback");
            return {
                latitude: cached.latitude,
                longitude: cached.longitude,
                accuracy: cached.accuracy
            };
        }
        
        throw new Error("Failed to get your location. Please check your browser permissions.");
    }
};
  
export { 
	getLocationData,
	getCurrentUserLocation, 
	locationCache
};
  