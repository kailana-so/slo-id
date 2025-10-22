import { commonHeaders } from "@/lib/commonHeaders";
import type { FormData } from "@/types/note";

export const getNoteSuggestions =  async (sighting: FormData, type: string) => {

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
		console.log('Error getting suggestions: ', JSON.stringify(res))
		const error = await res.text();
		throw new Error(`Failed to fetch suggestions: ${error}`);
	}

	const { suggestions } = await res.json();
	return suggestions;

}