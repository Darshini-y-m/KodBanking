import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

router.get('/balance', verifyAuth, async (req, res) => {
  try {
    const { username } = req.user;

    const result = await query(
      'SELECT balance FROM kodusers WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, balance: parseFloat(user.balance) });
  } catch (err) {
    console.error('Balance error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch balance' });
  }
});

export default router;
