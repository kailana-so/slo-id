import { Router, Request, Response } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
        const BUCKET = process.env.AWS_BUCKET;
    
        const { userId, filenames, imageType } = req.body;

        if (!userId || !Array.isArray(filenames) || !imageType) {
            return res.status(400).json({ message: "Missing userId or filenames[] or type" });
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
        
        return res.status(200).json({ urls: urls });

    } catch (err: unknown) {
        console.error("Error generating signed URLs", err);
        return ErrorResponse("Error generating URLs", err, 500, res);
    }
});

export default router;
