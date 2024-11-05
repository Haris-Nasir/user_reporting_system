const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',           
  database: 'user_reporting',    
  password: 'admin', 
  port: 5432,                   
});

const connectDB = async () => {
  try {
    await pool.connect(); 
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
