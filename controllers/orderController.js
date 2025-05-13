const { pool } = require('../config/db');

exports.getOrderHistory = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [orders] = await pool.query(
            `SELECT o.id as orderId, o.order_date, o.total_amount, o.status,
                    a.id as addressId, a.fullName, a.phone, a.street, a.pincode, a.city, a.state
             FROM orders o
             JOIN addresses a ON o.shipping_address_id = a.id
             WHERE o.user_id = ?
             ORDER BY o.order_date DESC`,
            [userId]
        );

        if (orders.length === 0) {
            return res.json([]);
        }

        const orderIds = orders.map(o => o.orderId);
        const [items] = await pool.query(
            `SELECT oi.order_id, oi.quantity, oi.size, oi.price_at_purchase,
                    p.id as productId, p.title, p.img, p.company
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id IN (?)`,
            [orderIds]
        );

        const itemsByOrderId = items.reduce((acc, item) => {
            const orderId = item.order_id;
            if (!acc[orderId]) {
                acc[orderId] = [];
            }
            acc[orderId].push({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                price_at_purchase: item.price_at_purchase,
                title: item.title,
                img: item.img,
                company: item.company
            });
            return acc;
        }, {});

        const ordersWithDetails = orders.map(order => ({
            orderId: order.orderId,
            orderDate: order.order_date,
            totalAmount: order.total_amount,
            status: order.status,
            shippingAddress: {
                id: order.addressId,
                fullName: order.fullName,
                phone: order.phone,
                street: order.street,
                pincode: order.pincode,
                city: order.city,
                state: order.state
            },
            items: itemsByOrderId[order.orderId] || []
        }));

        res.json(ordersWithDetails);

    } catch (error) {
        console.error(`Error fetching orders for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.createOrder = async (req, res) => {
    const userId = req.user.userId;
    const { shippingAddressId, items } = req.body;

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [addressCheck] = await connection.query(
            'SELECT id FROM addresses WHERE id = ? AND user_id = ?',
            [shippingAddressId, userId]
        );
        if (addressCheck.length === 0) {
            await connection.rollback();
            return res.status(403).json({ error: 'Invalid shipping address ID' });
        }

        let totalAmount = 0;
        const orderItemValues = [];
        for (const item of items) {
            if (!item.id || !item.quantity || !item.size) {
                await connection.rollback();
                return res.status(400).json({ error: `Invalid item data: ${JSON.stringify(item)}` });
            }
            const price = Number(item.newPrice);
            if (price === undefined) {
                await connection.rollback();
                return res.status(400).json({ error: `Product with ID ${item.id} not found or price missing` });
            }
            totalAmount += Number(item.quantity) * price;
            orderItemValues.push([
                item.id,
                item.quantity,
                item.size,
                price
            ]);
        }

        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_amount, shipping_address_id) VALUES (?, ?, ?)',
            [userId, totalAmount, shippingAddressId]
        );
        const orderId = orderResult.insertId;

        const finalOrderItemValues = orderItemValues.map(item => [orderId, ...item]);
        await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity, size, price_at_purchase) VALUES ?',
            [finalOrderItemValues]
        );

        await connection.commit();

        res.status(201).json({ message: 'Order placed successfully', orderId: orderId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(`Error creating order for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to place order' });
    } finally {
        if (connection) connection.release();
    }
};
