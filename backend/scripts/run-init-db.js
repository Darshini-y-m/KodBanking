import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDb() {
  try {
    const sqlPath = join(__dirname, '..', 'src', 'scripts', 'init-db.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully. Tables: kodusers, cjwt');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
