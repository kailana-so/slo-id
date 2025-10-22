export const systemKeyMiddleware = (req, res, next) => {
    const systemKey = req.headers['x-system-key'];
    const validSystemKey = process.env.NEXT_PUBLIC_X_SYSTEM_KEY;
    if (systemKey !== validSystemKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
