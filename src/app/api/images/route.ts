import ErrorResponse from "@/utils/errorResponse";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ 
	region: "ap-southeast-2",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
 });
const BUCKET = process.env.AWS_BUCKET;

export async function POST(req: Request): Promise<Response> {	
	try {
		const body = await req.json();
		const { userId, filenames, imageType } = body;

		if (!userId || !Array.isArray(filenames) || !imageType) {
			return new Response(
				JSON.stringify({ message: "Missing userId or filenames[] or type" }),
				{ status: 400 }
			);
		}

		const urls = await Promise.all(
			filenames.map(async (filename: string) => {
				const command = new GetObjectCommand({
					Bucket: BUCKET,
					Key: `${imageType}/${userId}/${filename}_${imageType}.png`,
				});

				const url = await getSignedUrl(s3, command, { expiresIn: 600 });
				return { filename, url };
			})
		);
		return new Response(
			JSON.stringify({ 
				urls: urls
			}), 
			{ status: 200 }
		);

	} catch (err: unknown) {
		console.error("Error generating signed URLs", err);
		return ErrorResponse("Error generating URLs", err, 500);
	}
}
