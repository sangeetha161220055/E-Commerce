const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require('../controllers/orderController');


// Create Order
router.post('/order', createOrder);


// Get All Orders
router.get('/', getOrders);


// Update Order Status
router.put('/order/:id', updateOrderStatus);


module.exports = router;