const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

class UsersStorage {
  // Add a new user to the database
  async addUser({ firstName, lastName, email, age, bio }) {
    try {
      const q = `INSERT INTO users ("firstName", "lastName", "email", "age", "bio")
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const res = await pool.query(q, [
        firstName,
        lastName,
        email,
        !age ? null : parseInt(age),
        bio,
      ]);
      return res.rows[0];
    } catch (error) {
      console.error('Error adding user:', error);
      throw error; 
    }
  }

  // Retrieve all users
  async getUsers() {
    try {
      const res = await pool.query('SELECT * FROM users');
      return res.rows;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
  }

  async getUsersByKeyword(keyword) {
    try {
      const cleanedKeyword = keyword.toLowerCase().trim().replace(/\s+/g, ' ');
      const q = `%${cleanedKeyword}%`;

      const res = await pool.query(
        `SELECT * FROM users 
         WHERE LOWER("firstName") LIKE $1 
            OR LOWER("lastName") LIKE $1 
            OR LOWER("firstName" || ' ' || "lastName") LIKE LOWER(REGEXP_REPLACE($1, '\\s+', ' ', 'g'))
            OR LOWER("email") LIKE $1`,
        [q]
      );

      return res.rows;
    } catch (error) {
      console.error('Error retrieving users by keyword:', error);
      throw error;
    }
  }

  // Retrieve a user by ID
  async getUserById(id) {
    try {
      const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return res.rows[0];
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      throw error;
    }
  }

  // Update a user's data by ID
  async updateUserById(id, data) {
    try {
      const query = `
        UPDATE users
        SET "firstName" = $1,
            "lastName" = $2,
            "email" = $3,
            "age" = $4,
            "bio" = $5
        WHERE id = $6
        RETURNING *`;
      const values = [
        data.firstName,
        data.lastName,
        data.email,
        data.age,
        data.bio,
        id,
      ];
      await pool.query(query, values);
    } catch (error) {
      console.error('Error updating user by ID:', error);
      throw error;
    }
  }

  // Delete a user by ID
  async deleteUser(id) {
    try {
      const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
      const res = await pool.query(query, [id]);
      return res.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = new UsersStorage();
