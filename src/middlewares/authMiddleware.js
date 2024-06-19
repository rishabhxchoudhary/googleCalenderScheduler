import { oauth2Client } from '../config/googleConfig.js';

export const authMiddleware = (req, res, next) => {
    req.oauth2Client = oauth2Client;
    next();
};