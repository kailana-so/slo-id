import { commonHeaders } from "@/lib/commonHeaders"; 
import { EnvironmentalData } from "@/types/environment";

const getEnvironmentalData = async (
    lat: number,
    lng: number,
): Promise<{ environment: EnvironmentalData }> => {

    const res = await fetch("/api/weather", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...commonHeaders()
        },
        body: JSON.stringify({ lat, lng }),
    });
    if (!res.ok) {
        const error = await res.text();
        console.error("Error from API:", error);
        throw new Error(`Failed to fetch environmental data: ${error}`);
    }

    const { main, sys, weather, wind }  = await res.json();
    console.log({ main, sys, weather: weather[0], wind }, "{ main, sys, weather: weather[0], wind }")

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