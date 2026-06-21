import jwt from 'jsonwebtoken'
import { createTokens, ExistingUser } from '../service/auth.service.js';
import { cookieOptions } from '../constants/cookie.constant.js';

// checks authenticity of user
export const authMiddleware = async (req, res, next) => {
    try {
        // Fetch the tokens
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;
        // decode the token with access token
        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET)
            req.user = decoded;
            return next();
        }
        // decode the token with refresh token
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
            const user = await ExistingUser(decoded.email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await createTokens(user.name, user.email);
            res.cookie('access_token', newAccessToken, { ...cookieOptions,maxAge: 15 * 60 * 1000})
            res.cookie('refresh_token', newRefreshToken, { ...cookieOptions,maxAge: 7 * 24 * 60 * 60 * 1000})
            req.user = user
            return next();
        }
        // Unauthorize the user if no tokens found
        return res.status(401).json({ success: false, message: 'Unauthorized' });

    } catch (error) {
        console.error('Error while checking the authenticity', error);
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
}