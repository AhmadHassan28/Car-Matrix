const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. GLOBAL MIDDLEWARE FIRST
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// 2. HEALTH CHECK
app.get('/', (req, res) => res.json({ message: 'CarMatrix API running' }));

// 3. ROUTES LAST
app.route('/api/auth',     require('./routes/auth'));
app.route('/api/drivers',  require('./routes/drivers'));
app.route('/api/services', require('./routes/services'));
app.route('/api/cars',     require('./routes/cars'));
app.route('/api/bookings', require('./routes/bookings'));
app.route('/api/payments', require('./routes/payments'));
app.route('/api/admin',    require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));