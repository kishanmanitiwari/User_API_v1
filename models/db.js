// models/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Setup PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your database URL
});

export default pool;
