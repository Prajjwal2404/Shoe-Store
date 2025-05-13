const { pool } = require('../config/db');

exports.getAllProducts = async (_, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(`Error fetching product with id ${productId}:`, error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

exports.updateTotalReviews = async (req, res) => {
    const productId = req.params.id;
    const { reviews, rating } = req.body;

    if (!reviews || !rating) {
        return res.status(400).json({ error: 'Reviews and rating are required' });
    }

    try {
        await pool.query(
            'UPDATE products SET reviews = ?, star = ? WHERE id = ?',
            [Number(reviews), Number(rating), productId]
        );
        res.json({ message: 'Product review stats updated successfully' });
    } catch (error) {
        console.error(`Error updating review stats for product ${productId}:`, error);
        res.status(500).json({ error: 'Failed to update review stats' });
    }
};

exports.getProductReviews = async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM reviews WHERE product_id = ?', [productId]);
        res.json(rows);
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

exports.addProductReview = async (req, res) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user.userId;
    const userName = req.user.username;

    if (!rating || !comment) {
        return res.status(400).json({ error: 'Rating and comment are required' });
    }

    try {
        const [reviewExists] = await pool.query(
            'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
            [productId, userId]
        );
        if (reviewExists.length === 0) {
            await pool.query(
                'INSERT INTO reviews (product_id, user_id, rating, comment, name) VALUES (?, ?, ?, ?, ?)',
                [productId, userId, rating, comment, userName]
            );
            res.status(201).json({ message: 'Review added successfully' });
        } else {
            await pool.query(
                'UPDATE reviews SET rating = ?, comment = ? WHERE product_id = ? AND user_id = ?',
                [rating, comment, productId, userId]
            );
            res.status(200).json({ message: 'Review updated successfully' });
        }
    } catch (error) {
        console.error(`Error adding review for product ${productId}:`, error);
        res.status(500).json({ error: 'Failed to add review' });
    }
}