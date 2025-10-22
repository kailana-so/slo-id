import { Router, Request, Response } from 'express';
import dns from 'node:dns';
import ErrorResponse from '../utils/errorResponse.js';
import '../lib/net.js'; // force ipv4 for fetch

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Missing lat/lng" });
    }

    try {
        const url = `${process.env.NOMINATION_API_HOST}?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": `slo-id-client/1.0 (${process.env.EMAIL_SIGNER})`
            }
        });
        const data = await response.json();
        const { boundingbox } = data;
        const { road, town, city, municipality, state, postcode, country_code } = data.address;
        
        if (!city && !municipality) {
            return res.status(404).json({ error: "No components found" });
        }

        return res.status(200).json({ 
            road, town, city, municipality, state, postcode, country_code, boundingbox 
        });
    } catch (err: unknown) {
        console.log("DNS default order:", dns.getDefaultResultOrder());
        return ErrorResponse("Failed to fetch geolocation", err, 500, res);
    }
});

export default router;
