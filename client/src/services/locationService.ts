import { commonHeaders } from "@/lib/commonHeaders";
import { LocationData } from "@/types/map";
import { getGeolocation } from "@/utils/getLocation.client";

const locationCache = new Map<string, LocationData>();
const userLocationCache = new Map<string, {latitude: number; longitude: number; accuracy: number; timestamp: number}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const getNearestIdentifiableLocation = async (
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

    return { location: locationData };
};

const getCurrentUserGeolocation = async (): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
}> => {
    const cacheKey = 'current_user_location';
    
    // Check cache first
	const cached = userLocationCache.get(cacheKey);
	if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
		return {
			latitude: cached.latitude,
			longitude: cached.longitude,
			accuracy: cached.accuracy
		};
	}

    try {
        const coords = await getGeolocation();
        
        // Cache the result
        userLocationCache.set(cacheKey, {
            ...coords,
            timestamp: Date.now()
        });
        return coords;
    } catch (error) {
        
        // If we have a cached location that's expired, we can still use it as fallback
        const cached = userLocationCache.get(cacheKey);
        if (cached) {
            return {
                latitude: cached.latitude,
                longitude: cached.longitude,
                accuracy: cached.accuracy
            };
        }
        
        // Provide a more helpful error message based on the error type
        if (error instanceof GeolocationPositionError) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    throw new Error("Location access denied. Please enable location permissions in your browser settings.");
                case error.POSITION_UNAVAILABLE:
                    throw new Error("Location information is unavailable. Please check your device's location services.");
                case error.TIMEOUT:
                    throw new Error("Location request timed out. Please try again.");
                default:
                    throw new Error("Failed to get your location. Please check your browser permissions and try again.");
            }
        }
        
        throw new Error("Failed to get your location. Please check your browser permissions and try again.");
    }
};
  
export { 
	getNearestIdentifiableLocation,
	getCurrentUserGeolocation, 
	locationCache
};
  