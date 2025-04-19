const { Pool } = require('pg');

const pool = new Pool({
  connectionString: `postgresql://${process.env.ROLE_NAME}:${process.env.ROLE_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
});

module.exports = pool;
