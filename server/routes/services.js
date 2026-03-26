// server/routes/services.js
const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Extra_Services');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
