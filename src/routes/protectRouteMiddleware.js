import * as admin from 'firebase-admin';

export const protectRouteMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authtoken;
        const user = await admin.auth().verifyIdToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'You must be logged in' });
    }
}