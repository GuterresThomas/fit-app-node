const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432, // Port do PostgreSQL
});

// Função para realizar consultas no banco de dados
async function query(text, values) {
  try {
    const result = await pool.query(text, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { query };
