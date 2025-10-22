import { Router } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
const router = Router();
router.post('/', async (req, res) => {
    const { lat, lng } = req.body;
    try {
        const url = `${process.env.WEATHER_API_HOST}?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
    }
    catch (err) {
        return ErrorResponse("Failed to fetch weather", err, 500, res);
    }
});
export default router;
