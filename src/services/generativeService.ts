import { commonHeaders } from "@/lib/commonHeaders";
import type { FormData } from "@/types/note";

export const getNoteSuggestions =  async (sighting: FormData, type: string) => {
 console.log("SUGGESTIONS request: ", JSON.stringify(sighting))
    const res = await fetch("/api/suggestions", {
		method: "POST",
		headers: { 
			"Content-Type": "application/json",
			...commonHeaders()
		},
		body: JSON.stringify({
			...sighting,
			type: type
		}),
	});

	if (!res.ok) {
		console.log('ERROR GETTING SUGGESTIONS:, ', JSON.stringify(res))
		const error = await res.text();
		throw new Error(`Failed to fetch suggestions: ${error}`);
	}

	const { suggestions } = await res.json();
    console.log("SUGGESTIONS", suggestions)
	return suggestions;

}