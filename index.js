const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testDbConnection } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

testDbConnection();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
