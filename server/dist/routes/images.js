import { Router } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const router = Router();
const s3 = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const BUCKET = process.env.AWS_BUCKET;
router.post('/', async (req, res) => {
    try {
        const { userId, filenames, imageType } = req.body;
        if (!userId || !Array.isArray(filenames) || !imageType) {
            return res.status(400).json({ message: "Missing userId or filenames[] or type" });
        }
        const urls = await Promise.all(filenames.map(async (filename) => {
            const command = new GetObjectCommand({
                Bucket: BUCKET,
                Key: `${imageType}/${userId}/${filename}_${imageType}.png`,
            });
            const url = await getSignedUrl(s3, command, { expiresIn: 600 });
            return { filename, url };
        }));
        return res.status(200).json({ urls: urls });
    }
    catch (err) {
        console.error("Error generating signed URLs", err);
        return ErrorResponse("Error generating URLs", err, 500, res);
    }
});
export default router;
