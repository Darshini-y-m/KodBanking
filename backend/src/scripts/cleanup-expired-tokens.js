import { query } from '../config/db.js';

export async function cleanupExpiredTokens() {
  try {
    const result = await query('DELETE FROM cjwt WHERE expiry < NOW() RETURNING tid');
    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} expired token(s)`);
    }
  } catch (err) {
    console.error('Token cleanup error:', err);
  }
}
