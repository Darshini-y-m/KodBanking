import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-min-32-chars';
const COOKIE_NAME = 'kodbank_token';

export async function verifyAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    const result = await query(
      'SELECT tid FROM cjwt WHERE token = $1 AND expiry > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Token expired or invalid' });
    }

    req.user = {
      username: decoded.sub,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
