const { pool } = require('../config/db');

const createUserSession = async (userId, page) => {
  const query = 'INSERT INTO user_sessions (user_id, page) VALUES ($1, $2)';
  await pool.query(query, [userId, page]);
};

const getAllSessions = async () => {
  const result = await pool.query('SELECT * FROM user_sessions');
  return result.rows;
};

module.exports = { createUserSession, getAllSessions };
