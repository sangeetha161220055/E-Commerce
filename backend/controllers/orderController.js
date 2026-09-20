const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

// ==========================================
// CREATE ORDER
// POST /api/v1/orders/order
// ==========================================

exports.createOrder = async (req, res, next) => {
    try {
        const cartItems = req.body;

        // Check cart items
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart items are required'
            });
        }

        // Calculate total amount
        const amount = Number(
            cartItems.reduce((acc, item) => {
                return acc + (
                    Number(item.product.price) *
                    Number(item.qty)
                );
            }, 0)
        ).toFixed(2);

        // Default order status
        const status = 'pending';

        // Create order
        const order = await orderModel.create({
            cartItems,
            amount,
            status,
            createdAt: new Date()
        });

        // Update product stock
        for (const item of cartItems) {

            const product = await productModel.findById(
                item.product._id
            );

            if (product) {

                product.stock =
                    Number(product.stock) -
                    Number(item.qty);

                await product.save();
            }
        }

        res.status(201).json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// GET ALL ORDERS
// GET /api/v1/orders
// ==========================================

exports.getOrders = async (req, res, next) => {

    try {

        const orders = await orderModel.find();

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// UPDATE ORDER STATUS
// PUT /api/v1/orders/order/:id
// ==========================================

exports.updateOrderStatus = async (req, res, next) => {

    try {

        const { status } = req.body;

        // Check status
        const allowedStatuses = [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });

        }

        // Find order
        const order = await orderModel.findById(
            req.params.id
        );

        if (!order) {

            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });

        }

        // Update status
        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};