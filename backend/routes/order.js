const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
router.post('/', (req, res) => {
    try {
        const { customerName, customerEmail, totalAmount, items, userId, phone, city, zip, address } = req.body;

        if (!customerName || !customerEmail || !totalAmount || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Please provide all required order details with items array' });
        }

        // Atomic Transaction for Order + Items
        const createOrder = db.transaction((orderData) => {
            const { name, email, amount, uid, tel, ucity, uzip, uaddr, cartItems } = orderData;
            
            // 1. Insert into orders
            const orderStmt = db.prepare(`
                INSERT INTO orders (customerName, customerEmail, totalAmount, items, userId, phone, city, zip, address, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            // Keep JSON items for legacy compatibility
            const itemsJson = JSON.stringify(cartItems);
            const orderResult = orderStmt.run(name, email, amount, itemsJson, uid, tel, ucity, uzip, uaddr, 'Pending');
            const orderId = orderResult.lastInsertRowid;

            // 2. Insert into order_items (The Snapshot Logic)
            const itemStmt = db.prepare(`
                INSERT INTO order_items (orderId, productId, name, price, quantity, image)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            for (const item of cartItems) {
                itemStmt.run(orderId, item.id, item.name, item.price, item.quantity, item.image);
                
                // 3. Stock Guard: Decrement inventory
                db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.id);
            }

            return orderId;
        });

        const orderId = createOrder({
            name: customerName,
            email: customerEmail,
            amount: totalAmount,
            uid: userId || null,
            tel: phone || null,
            ucity: city || null,
            uzip: zip || null,
            uaddr: address || null,
            cartItems: items
        });

        res.status(201).json({
            id: orderId,
            message: 'Order placed successfully and inventory secured.'
        });
    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(500).json({ message: 'Error processing order', error: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get('/my-orders', protect, (req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your orders', error: error.message });
    }
});

module.exports = router;
