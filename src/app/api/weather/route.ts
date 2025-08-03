import ErrorResponse from "@/utils/errorResponse";

export async function POST(
    req: Request,
): Promise<Response> {
    
    const { lat, lng } = await req.json();

    try {
        const url = `${process.env.WEATHER_API_HOST}?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const response = await fetch(url);
		const data = await response.json();
        return new Response(
			JSON.stringify(data),
			{ status: 200 }
		);
    } catch (err: unknown) {
        return ErrorResponse("Failed to fetch geolocation", err, 500);
    }
}