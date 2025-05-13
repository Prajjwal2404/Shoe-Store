const { pool } = require('../config/db');

exports.getCart = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [items] = await pool.query(
            `SELECT ci.product_id as id, ci.quantity, ci.size, p.title, p.img, p.newPrice, p.prevPrice, p.company
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = ?`,
            [userId]
        );
        res.json(items);
    } catch (error) {
        console.error(`Error fetching cart for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity, size } = req.body;

    if (!productId || quantity === undefined || quantity === null || size === undefined || size === null) {
        return res.status(400).json({ error: 'Missing required fields: productId, quantity, size' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive' });
    }

    try {
        const [productExists] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (productExists.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await pool.query(
            `INSERT INTO cart_items (user_id, product_id, quantity, size)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), size = VALUES(size)`,
            [userId, productId, quantity, size]
        );

        const [items] = await pool.query(
            `SELECT ci.product_id as id, ci.quantity, ci.size, p.title, p.img, p.newPrice, p.prevPrice, p.company
              FROM cart_items ci
              JOIN products p ON ci.product_id = p.id
              WHERE ci.user_id = ?`,
            [userId]
        );
        res.status(201).json(items);

    } catch (error) {
        console.error(`Error adding item to cart for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

exports.updateCartItem = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity, size } = req.body;

    if (quantity === undefined && size === undefined) {
        return res.status(400).json({ error: 'Must provide quantity or size to update' });
    }

    if (quantity !== undefined && quantity <= 0) {
        try {
            await pool.query(
                'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            const [items] = await pool.query(
                `SELECT ci.product_id as id, ci.quantity, ci.size, p.title, p.img, p.newPrice, p.prevPrice, p.company
                  FROM cart_items ci
                  JOIN products p ON ci.product_id = p.id
                  WHERE ci.user_id = ?`,
                [userId]
            );
            return res.json(items);
        } catch (error) {
            console.error(`Error deleting cart item (via update) for user ${userId}:`, error);
            return res.status(500).json({ error: 'Failed to update cart item' });
        }
    }

    let setClauses = [];
    let values = [];
    if (quantity !== undefined) {
        setClauses.push('quantity = ?');
        values.push(quantity);
    }
    if (size !== undefined) {
        setClauses.push('size = ?');
        values.push(size);
    }
    values.push(userId, productId);

    try {
        const [result] = await pool.query(
            `UPDATE cart_items SET ${setClauses.join(', ')} WHERE user_id = ? AND product_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cart item not found for this user' });
        }

        const [items] = await pool.query(
            `SELECT ci.product_id as id, ci.quantity, ci.size, p.title, p.img, p.newPrice, p.prevPrice, p.company
              FROM cart_items ci
              JOIN products p ON ci.product_id = p.id
              WHERE ci.user_id = ?`,
            [userId]
        );
        res.json(items);

    } catch (error) {
        console.error(`Error updating cart item for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

exports.removeCartItem = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        await pool.query(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        const [items] = await pool.query(
            `SELECT ci.product_id as id, ci.quantity, ci.size, p.title, p.img, p.newPrice, p.prevPrice, p.company
              FROM cart_items ci
              JOIN products p ON ci.product_id = p.id
              WHERE ci.user_id = ?`,
            [userId]
        );
        res.status(200).json(items);

    } catch (error) {
        console.error(`Error deleting cart item for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to delete cart item' });
    }
};

exports.clearCart = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [result] = await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        console.log(`Cleared cart for user ${userId}. Rows affected: ${result.affectedRows}`);
        res.status(204).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(`Error clearing cart for user ${userId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
