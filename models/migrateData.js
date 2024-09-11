// migrateData.js
import fs from 'fs';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

// Path to the JSON file
const __dirname = path.resolve('./');
console.log(__dirname);

const usersFilePath = path.join(__dirname, 'MOCK_DATA.json'); // Adjusted to root directory

// Function to read users from the JSON file
const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

// Function to insert users into PostgreSQL
const insertUsersIntoDB = async (users) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery = `
      INSERT INTO users (first_name, last_name, gender, email, job_title)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    
    for (const user of users) {
      await client.query(insertQuery, [
        user.first_name,
        user.last_name,
        user.gender,
        user.email,
        user.job_title
      ]);
    }

    await client.query('COMMIT');
    console.log('Data migrated successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting data into PostgreSQL:', err);
  } finally {
    client.release();
  }
};

// Main function to run the migration
const migrateData = async () => {
  try {
    const users = readUsersFromFile();
    await insertUsersIntoDB(users);
  } catch (err) {
    console.error('Error reading or migrating data:', err);
  } finally {
    pool.end();
  }
};

migrateData();

