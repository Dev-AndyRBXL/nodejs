// db.js
const pool = require('./pool'); // Assuming pool.js sets up and exports pg.Pool correctly

class Database {
  getUsers = async () => {
    // No issues found, keeping as is
    const { rows } = await pool.query('SELECT * FROM users ORDER BY name ASC;'); // Added ORDER BY for consistent results
    console.log('users:', rows);
    return rows;
  };

  getUsersByKeyword = async (keyword) => {
    // No functional issues found, keeping as is (unless search scope needs expanding)
    if (typeof keyword !== 'string' || !keyword.trim()) {
      // It's often better to return an empty array for search if the keyword is invalid/empty
      // rather than throwing an error, depending on desired UX.
      // Or keep throwing if it's considered an exceptional case.
      // Let's assume returning empty is preferred for a search endpoint.
      console.warn('Invalid or empty keyword provided for search.');
      return [];
      // throw new Error('Invalid keyword'); // Original behavior
    }

    const searchTerm = `%${keyword.trim().replace(/\s+/g, ' ')}%`;

    try {
      const { rows } = await pool.query(
        `SELECT * FROM users WHERE name ILIKE $1 ORDER BY name ASC;`, // Added ORDER BY
        [searchTerm]
      );
      return rows;
    } catch (error) {
      console.error('Error in getUsersByKeyword:', error);
      throw error; // Re-throw the error to be handled by the async handler
    }
  };

  getUserById = async (userId) => {
    // No issues found, keeping as is
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1;
      `,
      [userId]
    );
    return rows[0]; // Returns undefined if not found, handled in controller
  };

  getItems = async () => {
    // No issues found, keeping as is
    const { rows } = await pool.query(
      'SELECT * FROM items ORDER BY title ASC;'
    ); // Added ORDER BY
    console.log('items:', rows);
    return rows;
  };

  addUser = async (user) => {
    // No functional issues, but changed return for consistency
    const {
      name,
      email,
      password_hash,
      phone,
      profile_picture_url,
      address,
      city,
      rating,
      joined_at, // Ensure this is in a format pg understands (like ISO 8601 string)
    } = user;
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO users (name, email, password_hash, phone, profile_picture_url, address, city, rating, joined_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
        `,
        [
          name,
          email,
          password_hash, // Ensure this is properly hashed *before* calling addUser
          phone || null, // Explicitly set optional fields to null if falsy
          profile_picture_url || null,
          address || null,
          city || null,
          rating, // Already converted to Number in controller
          joined_at || null, // Use null if not provided
        ]
      );
      // FIX: Return the created user object directly, not the array
      return rows[0];
    } catch (error) {
      console.error('Error in addUser:', error);
      throw error; // Re-throw the error
    }
  };

  deleteUser = async (userId) => {
    // No issues found, keeping as is
    try {
      const { rows } = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *;`,
        [userId]
      );
      // Explicitly return null if user not found/deleted
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  };

  addItem = async (item) => {
    // No functional issues, but added error handling and explicit nulls
    const {
      user_id,
      title,
      description,
      category,
      price,
      is_available,
      image_urls, // Ensure this is an array type supported by PG or stringified
      listed_at,
      location,
      is_service,
    } = item;
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO items (user_id, title, description, category, price, is_available, image_urls, listed_at, location, is_service)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
        `,
        [
          user_id,
          title,
          description || null,
          category || null,
          price, // Assume price is required
          is_available === true, // Ensure boolean
          image_urls || null, // Use null if not provided or handle array format
          listed_at || new Date(), // Default to now if not provided
          location || null,
          is_service === true, // Ensure boolean
        ]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in addItem:', error);
      throw error;
    }
  };

  deleteItem = async (itemId) => {
    try {
      const { rows } = await pool.query(
        `
        DELETE FROM items
        WHERE item_id = $1 -- Make sure the column name is correct (e.g., id or item_id)
        RETURNING *;
        `,
        [itemId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error in deleteItem:', error);
      throw error;
    }
  };
}

module.exports = new Database();
