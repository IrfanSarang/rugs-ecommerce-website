const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @desc    Validate a promo code
// @route   POST /api/coupons/validate
// @access  Public
router.post('/validate', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Promo code is required' });
    }

    try {
        const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND isActive = 1').get(code.toUpperCase());

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or inactive promo code' });
        }

        // Check expiry
        const currentDate = new Date().toISOString().split('T')[0];
        if (coupon.expiryDate && coupon.expiryDate < currentDate) {
            return res.status(400).json({ message: 'This promo code has expired' });
        }

        res.json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        });
    } catch (error) {
        console.error('Coupon Validation Error:', error);
        res.status(500).json({ message: 'Internal server error during validation' });
    }
});

module.exports = router;
