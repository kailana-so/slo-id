import { Router, Request, Response } from 'express';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    console.log('Session route called with body:', req.body);
    const { userId } = req.body;

    if (!userId) {
        console.log('Missing user ID in session request');
        return res.status(400).json({ error: 'Missing user ID' });
    }

    // Set cookie
    res.cookie('id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    console.log('Session cookie set successfully for user:', userId);
    return res.json({ success: true });
});

export default router;
