import { Router } from 'express';
const router = Router();
router.post('/', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }
    // Set cookie
    res.cookie('id', userId, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
    });
    return res.json({ success: true });
});
export default router;
