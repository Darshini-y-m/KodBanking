import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../config/db.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-min-32-chars';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const COOKIE_NAME = 'kodbank_token';
const isProd = process.env.NODE_ENV === 'production';

const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 255 }).withMessage('Username must be 3-255 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().trim().isLength({ max: 50 }),
];

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required'),
];

router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO kodusers (username, email, password, phone, role, balance)
       VALUES ($1, $2, $3, $4, 'Customer', 100000)`,
      [username, email, hashedPassword, phone || null]
    );

    res.status(201).json({ success: true, message: 'Registration successful. Please login.' });
  } catch (err) {
    if (err.code === '23505') {
      const field = err.detail?.includes('username') ? 'username' : 'email';
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body;

    const result = await query(
      'SELECT uid, username, password, role FROM kodusers WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { role: user.role },
      JWT_SECRET,
      {
        subject: user.username,
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRY,
      }
    );

    const decoded = jwt.decode(token);
    const expiry = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    await query(
      'INSERT INTO cjwt (token, uid, expiry) VALUES ($1, $2, $3)',
      [token, user.uid, expiry]
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.get('/verify', async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ success: false });

  try {
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    const result = await query(
      'SELECT 1 FROM cjwt WHERE token = $1 AND expiry > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false });
    }

    res.json({ success: true });
  } catch {
    res.status(401).json({ success: false });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (token) {
    try {
      await query('DELETE FROM cjwt WHERE token = $1', [token]);
    } catch (err) {
      console.error('Logout token cleanup:', err);
    }
  }

  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ success: true });
});

export default router;