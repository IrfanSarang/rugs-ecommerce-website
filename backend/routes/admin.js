const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Public Product Routes ---

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/products', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM products');
        const products = stmt.all();
        
        const formattedProducts = products.map(p => {
            // Handle price: if already formatted (string with ₹), keep it; otherwise format
            let formattedPrice = p.price;
            const numericPrice = typeof p.price === 'string' 
                ? parseFloat(p.price.replace(/[₹,]/g, '')) 
                : p.price;
            if (!isNaN(numericPrice)) {
                formattedPrice = `₹${numericPrice.toLocaleString('en-IN')}`;
            }
            return {
                ...p,
                price: formattedPrice,
                isFeatured: p.isFeatured === 1
            };
        });
        
        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// --- Admin Section ---

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
router.get('/admin/stats', protect, admin, (req, res) => {
    try {
        console.log('Fetching stats: Start');
        const totalRevenueResult = db.prepare("SELECT SUM(totalAmount) as total FROM orders WHERE status != 'Cancelled'").get();
        const totalRevenue = (totalRevenueResult && totalRevenueResult.total) || 0;
        console.log('Fetching stats: totalRevenue', totalRevenue);

        const orderCountResult = db.prepare('SELECT COUNT(*) as count FROM orders').get();
        const orderCount = (orderCountResult && orderCountResult.count) || 0;
        console.log('Fetching stats: orderCount', orderCount);

        const userCountResult = db.prepare('SELECT COUNT(*) as count FROM users').get();
        const userCount = (userCountResult && userCountResult.count) || 0;
        console.log('Fetching stats: userCount', userCount);

        const lowStockResult = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 5').get();
        const lowStockCount = (lowStockResult && lowStockResult.count) || 0;
        console.log('Fetching stats: lowStockCount', lowStockCount);

        // Fetch sales data for the last 7 days
        const salesData = [];
        const dayRevenueStmt = db.prepare(`
            SELECT SUM(totalAmount) as total 
            FROM orders 
            WHERE strftime('%Y-%m-%d', createdAt) = ? AND status != 'Cancelled'
        `);

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            console.log('Fetching stats: salesData for', dateString);
            const dayRevenueResult = dayRevenueStmt.get(dateString);
            const dayRevenue = (dayRevenueResult && dayRevenueResult.total) || 0;

            salesData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayRevenue
            });
        }

        // Fetch 5 most recent orders for the dashboard
        console.log('Fetching stats: recentOrders');
        const recentOrders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5').all() || [];
        console.log('Fetching stats: Done');

        // Calculate AOV
        const aov = orderCount > 0 ? (totalRevenue / orderCount).toFixed(0) : 0;

        // Fetch Fulfillment Status Breakdown
        const fulfillmentStatusResult = db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM orders 
            GROUP BY status
        `).all();
        
        const fulfillmentStatus = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        };
        fulfillmentStatusResult.forEach(row => {
            if (fulfillmentStatus.hasOwnProperty(row.status)) {
                fulfillmentStatus[row.status] = row.count;
            }
        });

        // Fetch Top Performing Products (Simulated calculation from Order JSON items)
        // In a production environment with high volume, this would be a separate aggregation table
        const allOrderItems = db.prepare("SELECT items FROM orders WHERE status != 'Cancelled'").all();
        const productStats = {};
        
        allOrderItems.forEach(order => {
            try {
                const items = JSON.parse(order.items);
                items.forEach(item => {
                    if (!productStats[item.name]) {
                        productStats[item.name] = { name: item.name, revenue: 0, quantity: 0, image: item.image };
                    }
                    productStats[item.name].revenue += item.price * item.quantity;
                    productStats[item.name].quantity += item.quantity;
                });
            } catch (e) {
                console.error("Error parsing order items for stats:", e);
            }
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Real DB Metrics (replacing hardcoded dummy data)
        
        // Recent activity: Orders in the last 24 hours
        const recentActivityResult = db.prepare(`
            SELECT COUNT(*) as count FROM orders 
            WHERE createdAt >= datetime('now', '-24 hours')
        `).get();
        const recentActivity = (recentActivityResult && recentActivityResult.count) || 0;
        
        // Abandoned/Cancelled Rate from actual orders
        const cancelledResult = db.prepare(`
            SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'
        `).get();
        const cancelledCount = (cancelledResult && cancelledResult.count) || 0;
        const abandonedRate = orderCount > 0 
            ? ((cancelledCount / orderCount) * 100).toFixed(1) + '%' 
            : '0%';

        // User registration breakdown (real data)
        const newUsersThisWeek = db.prepare(`
            SELECT COUNT(*) as count FROM users 
            WHERE createdAt >= datetime('now', '-7 days')
        `).get();
        const newUsersCount = (newUsersThisWeek && newUsersThisWeek.count) || 0;

        // Product count by category (real data for insights)
        const categoryBreakdown = db.prepare(`
            SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC
        `).all() || [];

        res.json({
            totalRevenue,
            orderCount,
            userCount,
            lowStockCount,
            conversionRate: (orderCount / (userCount || 1) * 100).toFixed(1) + '%',
            aov,
            fulfillmentStatus,
            topProducts,
            recentActivity, // replaces dummy activeCarts
            abandonedRate,  // now real
            newUsersThisWeek: newUsersCount,
            categoryBreakdown,  // replaces dummy trafficSources
            salesData,
            recentOrders
        });
    } catch (error) {
        console.error('CRITICAL: Admin Stats Error Details:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// --- Admin Product Routes ---

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Admin
router.post('/admin/products', protect, admin, (req, res) => {
    try {
        const { name, sku, category, description, price, image, rating, stock, isFeatured } = req.body;
        
        const stmt = db.prepare(`
            INSERT INTO products (name, sku, category, description, price, image, rating, stock, isFeatured) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(name, sku, category, description || '', price, image, rating || 0, stock || 0, isFeatured ? 1 : 0);
        res.status(201).json({ id: result.lastInsertRowid, message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Admin
router.put('/admin/products/:id', protect, admin, (req, res) => {
    try {
        const { name, sku, category, description, price, image, rating, stock, isFeatured } = req.body;
        const id = req.params.id;
        
        const stmt = db.prepare(`
            UPDATE products 
            SET name = ?, sku = ?, category = ?, description = ?, price = ?, image = ?, rating = ?, stock = ?, isFeatured = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        const result = stmt.run(name, sku, category, description || '', price, image, rating || 0, stock || 0, isFeatured ? 1 : 0, id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Admin
router.delete('/admin/products/:id', protect, admin, (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        const result = stmt.run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// --- Admin Order Routes ---

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin
router.get('/admin/orders', protect, admin, (req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
router.put('/admin/orders/:id/status', protect, admin, (req, res) => {
    try {
        const { status } = req.body;
        const stmt = db.prepare('UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        const result = stmt.run(status, req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// @desc    Delete an order
// @route   DELETE /api/admin/orders/:id
// @access  Admin
router.delete('/admin/orders/:id', protect, admin, (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
        const result = stmt.run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order permanently removed from archives' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

// --- Admin User Routes ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get('/admin/users', protect, admin, (req, res) => {
    try {
        // Exclude passwords for security
        const stmt = db.prepare('SELECT id, name, email, isAdmin, createdAt FROM users');
        const users = stmt.all();
        
        const formattedUsers = users.map(u => ({
            ...u,
            isAdmin: u.isAdmin === 1
        }));
        
        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin (Unprotected for demo)
router.delete('/admin/users/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// @desc    Update user role (isAdmin)
// @route   PUT /api/admin/users/:id/role
// @access  Admin
router.put('/admin/users/:id/role', protect, admin, (req, res) => {
    try {
        const { isAdmin } = req.body;
        const id = req.params.id;

        // Prevent self-demotion if the admin wants to be safe
        if (req.user.id == id && !isAdmin) {
            return res.status(400).json({ message: "You cannot demote your own Master status." });
        }

        const stmt = db.prepare('UPDATE users SET isAdmin = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        const result = stmt.run(isAdmin ? 1 : 0, id);
        
        if (result.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: `User role updated to ${isAdmin ? 'Admin' : 'Customer'}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

module.exports = router;
