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
		const error = await res.text();
		throw new Error(`Failed to fetch suggestions: ${error}`);
	}

	const { suggestions } = await res.json();
    console.log("suggestions", suggestions)
	return suggestions;

}