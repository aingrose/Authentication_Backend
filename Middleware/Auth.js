

import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(403).json({ error: 'Authorization token missing' });
        }

        console.log(token);
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verified);
    
        req.user = verified;
        next();
    } catch (err) {
        console.error('Error in auth middleware:', err.message)
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
} 

