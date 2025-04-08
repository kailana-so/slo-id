import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET || "slo-id-images";

export async function POST(req: Request) {
    try {
        const { userId, thumbnailImageFile, fullImageFile } = await req.json();

        if (!userId || !thumbnailImageFile || !fullImageFile) {
        return new Response(
            JSON.stringify({ error: "Missing userId or image files" }),
            { status: 400 }
        );
        }

        const baseKey = `${userId}/${crypto.randomUUID()}`;

        const thumbnailKey = `thumbnail/${baseKey}_thumbnail.png`;
        const fullKey = `full/${baseKey}_full.png`;

        // Convert base64 to Buffer
        const thumbnailBuffer = Buffer.from(thumbnailImageFile, "base64");
        const fullBuffer = Buffer.from(fullImageFile, "base64");

        await Promise.all([
        s3.send(
            new PutObjectCommand({
            Bucket: BUCKET,
            Key: thumbnailKey,
            Body: thumbnailBuffer,
            ContentType: "image/png",
            })
        ),
        s3.send(
            new PutObjectCommand({
            Bucket: BUCKET,
            Key: fullKey,
            Body: fullBuffer,
            ContentType: "image/png",
            })
        ),
        ]);

        return new Response(
        JSON.stringify({
            message: "Image uploaded successfully",
            result: {
            thumbnailKey,
            fullKey,
            },
        }),
        { status: 200 }
        );
    } catch (error: any) {
        console.error("Error uploading images to S3:", error);

        return new Response(
        JSON.stringify({ error: error.message || "Upload failed" }),
        { status: 500 }
        );
    }
}
