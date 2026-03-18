const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// connectDB is called inside the module now
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');
const couponRoutes = require('./routes/coupon');

dotenv.config();

const app = express();
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Global Rate Limiter: General protection for all routes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5000, // Increased for debugging
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Strict Auth Limiter: Protect login/signup/reset from brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Increased for debugging
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many login attempts, please try again after 15 minutes' },
    skipSuccessfulRequests: true, // Only count failures towards the limit
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

app.get('/', (req, res) => {
    res.send('Farshe API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api', adminRoutes); // Mounts /api/admin/* and /api/products

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
