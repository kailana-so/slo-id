export async function GET(req: Request): Promise<Response> {
	const { searchParams } = new URL(req.url);
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");

	if (!lat || !lng) {
		return new Response(
			JSON.stringify({ error: "Missing lat/lng" }),
			{ status: 400 }
		);
	}

	console.log(process.env.OPENCAGE_API_KEY, "process.env.OPENCAGE_API_KEY")

	try {
		const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`;
		const response = await fetch(url);
		const data = await response.json();

		const {city, state_code} = data.results[0]?.components;

		console.log(city, state_code, "city, state_code")

		if (!city && !state_code) {
			return new Response(
				JSON.stringify({ error: "No components found" }),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({ city, state_code }),
			{ status: 200 }
		);
	} catch (err: any) {
		return new Response(
			JSON.stringify({ error: "Failed to fetch geolocation", message: err.message }),
			{ status: 500 }
		);
	}
}
