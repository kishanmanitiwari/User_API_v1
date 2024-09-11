// models/userModel.js
import pool from './db.js';

// User Model Functions
export const UserModel = {
  getAllUsers: async () => {
    try {
      const res = await pool.query('SELECT * FROM users');
      return res.rows;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  },

  // Filter users based on query parameters
  filterUsers: async (filters = {}, page = 1, limit = 10) => {
    const { gender, job_title } = filters;

    try {
      let query = 'SELECT * FROM users WHERE TRUE';
      const values = [];

      if (gender) {
        query += ` AND gender = $${values.push(gender)}`;
      }
      if (job_title) {
        query += ` AND job_title = $${values.push(job_title)}`;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${values.push(limit)} OFFSET $${values.push(offset)}`;

      const res = await pool.query(query, values);
      //console.log(typeof res.rows); Returns an object - {}
      
      return res.rows;
    } catch (err) {
      console.error('Error filtering users:', err);
      throw err;
    }
  },

  getUserById: async (id) => {
    try {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0];
    } catch (err) {
      console.error('Error fetching user by ID:', err);
      throw err;
    }
  },

  createUser: async (newUser) => {
    try {
      const { first_name, last_name, gender, email, job_title } = newUser;
      const res = await pool.query(
        'INSERT INTO users (first_name, last_name, gender, email, job_title) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [first_name, last_name, gender, email, job_title]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  },

  updateUser: async (id, updatedUser) => {
    try {
      const { first_name, last_name, gender, email, job_title } = updatedUser;
      const res = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, gender = $3, email = $4, job_title = $5 WHERE id = $6 RETURNING *',
        [first_name, last_name, gender, email, job_title, id]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      return res.rowCount > 0; // Return true if a row was deleted
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }
};
