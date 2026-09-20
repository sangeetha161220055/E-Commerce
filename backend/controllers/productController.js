const ProductModel = require('../models/productModel');

// Get All Products API - /api/v1/products
exports.getProducts = async (req, res, next) => {
    try {
        const query = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }
            : {};

        const products = await ProductModel.find(query);

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Product API - /api/v1/products/:id
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Unable to get Product with that ID'
        });
    }
};


// Create Product API - /api/v1/products
exports.createProduct = async (req, res, next) => {
    try {
        console.log("CREATE BODY:", req.body);

        const product = await ProductModel.create(req.body);

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Product API - /api/v1/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        console.log("UPDATE BODY:", req.body);

        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Product API - /api/v1/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};