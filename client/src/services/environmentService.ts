import { apiFetch } from "@/lib/api";
import { EnvironmentalData } from "@/types/environment";

const getEnvironmentalData = async (
    lat: number,
    lng: number,
): Promise<{ environment: EnvironmentalData }> => {

    const res = await apiFetch("/api/weather/", {
        method: "POST",
        body: JSON.stringify({ lat, lng }),
    });
    
    if (!res.ok) {
        const error = await res.text();
        console.error("Error from API:", error);
        throw new Error(`WEATHER API FAILED: ${error}`);
    }

    const { main, sys, weather, wind }  = await res.json();

    return {
        environment: { 
            main, 
            sys, 
            weather: weather[0], 
            wind 
        }
    } ;
};

  
export { getEnvironmentalData}