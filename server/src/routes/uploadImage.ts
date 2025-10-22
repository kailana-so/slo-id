import { Router, Request, Response } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const router = Router();

// AWS S3 client will be initialized inside the route handler

router.post('/', async (req: Request, res: Response) => {
    try {
        // Initialize S3 client inside the route handler to ensure env vars are loaded
        const s3 = new S3Client({
            region: process.env.AWS_REGION || "ap-southeast-2",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        const BUCKET = process.env.AWS_BUCKET || "slo-id-images";
        
        console.log('Upload route - AWS Region:', process.env.AWS_REGION);
        console.log('Upload route - AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Present' : 'Missing');
        console.log('Upload route - AWS Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Present' : 'Missing');
        console.log('Upload route - AWS Bucket:', process.env.AWS_BUCKET);

        const { userId, thumbnailImageFile, fullImageFile } = req.body;

        if (!userId || !thumbnailImageFile || !fullImageFile) {
            return res.status(400).json({ error: "Missing userId or image files" });
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

        return res.status(200).json({
            message: "Image uploaded successfully",
            result: {
                thumbnailKey,
                fullKey,
            },
        });
    } catch (error: unknown) {
        console.error("Error uploading images to S3:", error);
        return ErrorResponse("Upload failed", error, 500, res);
    }
});

export default router;
