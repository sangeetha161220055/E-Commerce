const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const connectDatabase = require('./config/connectDatabase');


// Load environment variables
dotenv.config({
    path: path.join(__dirname, 'config', 'config.env')
});


// Import routes
const products = require('./routes/product');
const orders = require('./routes/order');


// Connect to MongoDB
connectDatabase();


// Middleware
app.use(express.json());
app.use(cors());


// Product routes
app.use('/api/v1/products', products);


// Order routes
app.use('/api/v1/orders', orders);


// Production frontend
if (process.env.NODE_ENV === 'production') {

    app.use(
        express.static(
            path.join(__dirname, '..', 'frontend', 'build')
        )
    );

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname,
                '..',
                'frontend',
                'build',
                'index.html'
            )
        );
    });
}


// Home route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


module.exports = app;