import ErrorResponse from "@/utils/errorResponse";
import dns from "node:dns";
import "@/lib/net"; // force ipv4 for fetch

export async function POST(
	req: Request,
): Promise<Response> {
	
	console.log("DNS default order:", dns.getDefaultResultOrder());
	const { lat, lng } = await req.json();
	console.log("lat", lat);
	console.log("lng", lng);
	if (!lat || !lng) {
		return new Response(
			JSON.stringify({ error: "Missing lat/lng" }),
			{ status: 400 }
		);
	}
	try {
		const url = `${process.env.NOMINATION_API_HOST}?format=jsonv2&lat=${lat}&lon=${lng}`;
		console.log("url", url);
		const response = await fetch(url,
			{
			headers: {
				"User-Agent": `slo-id-client/1.0 (${process.env.EMAIL_SIGNER})`
			}
		});
		const data = await response.json();
		console.log("data", data);
		const {boundingbox } = data
		const {road, town, city, municipality, state, postcode, country_code } = data.address
		if (!city && !municipality) {
			return new Response(
				JSON.stringify({ error: "No components found" }),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({ road, town, city, municipality, state, postcode, country_code, boundingbox }),
			{ status: 200 }
		);
	} catch (err: unknown) {
		console.log("err", err);
		console.log("DNS default order:", dns.getDefaultResultOrder());
		
		return ErrorResponse("Failed to fetch geolocation", err, 500);
	}
}
