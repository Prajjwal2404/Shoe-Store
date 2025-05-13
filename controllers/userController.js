const { pool } = require('../config/db');

exports.getUserProfile = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = rows[0];

        res.json(user);
    } catch (error) {
        console.error(`Error fetching data for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};


exports.getUserAddresses = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [addresses] = await pool.query('SELECT * FROM addresses WHERE user_id = ? AND is_saved = 1 ORDER BY created_at DESC', [userId]);
        res.json(addresses);
    } catch (error) {
        console.error(`Error fetching addresses for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};

exports.addUserAddress = async (req, res) => {
    const userId = req.user.userId;
    const { fullName, phone, street, pincode, city, state, isSaved } = req.body;

    if (!fullName || !phone || !street || !pincode || !city || !state || isSaved === undefined) {
        return res.status(400).json({ error: 'Missing required address fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO addresses (user_id, fullName, phone, street, pincode, city, state, is_saved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, fullName, phone, street, pincode, city, state, parseInt(isSaved)]
        );
        const newAddressId = result.insertId;

        res.status(201).json(newAddressId);
    } catch (error) {
        console.error(`Error adding address for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to add address' });
    }
};

exports.updateUserAddress = async (req, res) => {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const { fullName, phone, street, pincode, city, state } = req.body;

    if (!fullName || !phone || !street || !pincode || !city || !state) {
        return res.status(400).json({ error: 'Missing required address fields' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE addresses SET fullName = ?, phone = ?, street = ?, pincode = ?, city = ?, state = ? WHERE id = ? AND user_id = ?',
            [fullName, phone, street, pincode, city, state, addressId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Address not found or not owned by user' });
        }

        const [updatedAddress] = await pool.query('SELECT * FROM addresses WHERE id = ?', [addressId]);
        res.json(updatedAddress[0]);

    } catch (error) {
        console.error(`Error updating address ${addressId} for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to update address' });
    }
};

exports.deleteUserAddress = async (req, res) => {
    const userId = req.user.userId;
    const { addressId } = req.params;

    try {
        const [isAddressReferenced] = await pool.query(
            'SELECT COUNT(*) AS count FROM orders WHERE shipping_address_id = ?',
            [addressId]
        );

        if (isAddressReferenced[0].count > 0) await pool.query(
            'UPDATE addresses SET is_saved = 0 WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        else await pool.query(
            'DELETE FROM addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        res.status(204).send();

    } catch (error) {
        console.error(`Error deleting address ${addressId} for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to delete address' });
    }
};


exports.getUserWishlist = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [rows] = await pool.query(
            `SELECT p.id, p.title, p.img, p.star, p.reviews, p.prevPrice, p.newPrice, p.company, p.color, p.category, p.gender
             FROM wishlist w
             JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(`Error fetching wishlist for user ${userId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addToWishlist = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Missing required field: productId' });
    }

    try {
        const [productExists] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (productExists.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await pool.query(
            'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        const [addedItem] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);

        res.status(201).json(addedItem[0] || { message: 'Item added to wishlist' });

    } catch (error) {
        console.error(`Error adding item to wishlist for user ${userId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        const [result] = await pool.query(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (result.affectedRows === 0) {
            console.log(`Wishlist item ${productId} not found for user ${userId} during delete.`);
        }

        res.status(204).send();

    } catch (error) {
        console.error(`Error deleting wishlist item ${productId} for user ${userId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
