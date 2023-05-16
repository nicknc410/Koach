const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Bbbggg45',
  database: 'MySQL',
});
// Middleware to measure response time
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const elapsed = Date.now() - start;
      console.log(`${req.method} ${req.url} - Response time: ${elapsed}ms`);
    });
    next();
  });
  
  // API endpoint for search
  app.get('/search', async (req, res) => {
    const { tags, category, price, type } = req.query;

  // Construct the SQL query based on the provided parameters
  let query = 'SELECT * FROM products WHERE 1=1';

  if (tags) {
    query += ` AND tags LIKE '%${tags}%'`;
  }

  if (category) {
    query += ` AND category = '${category}'`;
  }

  if (price) {
    query += ` AND price <= ${price}`;
  }

  if (type) {
    query += ` AND type = '${type}'`;
  }

  // Execute the query
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});