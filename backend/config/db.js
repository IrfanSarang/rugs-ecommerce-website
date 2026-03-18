const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const connectDB = () => {
    try {
        const dbPath = path.resolve(__dirname, '../../data/farshe.db');
        const dbDir = path.dirname(dbPath);

        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        const db = new Database(dbPath);
        console.log(`SQLite Connected: ${dbPath}`);

        // Initialize tables
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                isAdmin BOOLEAN DEFAULT 0,
                securityQuestion TEXT,
                securityAnswer TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                sku TEXT UNIQUE,
                category TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                image TEXT NOT NULL,
                rating INTEGER DEFAULT 0,
                stock INTEGER DEFAULT 0,
                isFeatured BOOLEAN DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER, -- Optional for guest checkout
                customerName TEXT NOT NULL,
                customerEmail TEXT NOT NULL,
                totalAmount REAL NOT NULL,
                status TEXT DEFAULT 'Pending', -- Pending, Paid, Processing, Shipped, Delivered, Returned, Cancelled
                items TEXT NOT NULL, -- JSON string of items (legacy)
                address TEXT,
                phone TEXT,
                city TEXT,
                zip TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orderId INTEGER NOT NULL,
                productId INTEGER NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                image TEXT,
                FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES products(id)
            );

            CREATE TABLE IF NOT EXISTS coupons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                discountType TEXT DEFAULT 'percentage',
                discountValue INTEGER NOT NULL,
                expiryDate TEXT,
                isActive INTEGER DEFAULT 1,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration: Add userId column if it doesn't exist
        const orderColumns = db.prepare("PRAGMA table_info(orders)").all();
        const hasUserId = orderColumns.some(col => col.name === 'userId');
        if (!hasUserId) {
            console.log('Migrating database: Adding userId column to orders...');
            db.exec("ALTER TABLE orders ADD COLUMN userId INTEGER");
        }

        const hasPhone = orderColumns.some(col => col.name === 'phone');
        if (!hasPhone) {
            console.log('Migrating database: Adding phone column to orders...');
            db.exec("ALTER TABLE orders ADD COLUMN phone TEXT");
        }

        const hasAddress = orderColumns.some(col => col.name === 'address');
        if (!hasAddress) {
            console.log('Migrating database: Adding address column to orders...');
            db.exec("ALTER TABLE orders ADD COLUMN address TEXT");
        }

        const hasCity = orderColumns.some(col => col.name === 'city');
        if (!hasCity) {
            console.log('Migrating database: Adding city column to orders...');
            db.exec("ALTER TABLE orders ADD COLUMN city TEXT");
        }

        const hasZip = orderColumns.some(col => col.name === 'zip');
        if (!hasZip) {
            console.log('Migrating database: Adding zip column to orders...');
            db.exec("ALTER TABLE orders ADD COLUMN zip TEXT");
        }

        // Migration: Add stock column if it doesn't exist
        const columns = db.prepare("PRAGMA table_info(products)").all();
        const hasStock = columns.some(col => col.name === 'stock');
        if (!hasStock) {
            console.log('Migrating database: Adding stock column to products...');
            db.exec("ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0");
        }

        const hasSku = columns.some(col => col.name === 'sku');
        if (!hasSku) {
            console.log('Migrating database: Adding sku column to products...');
            db.exec("ALTER TABLE products ADD COLUMN sku TEXT");
        }

        // Migration: Add material column if it doesn't exist
        const hasMaterial = columns.some(col => col.name === 'material');
        if (!hasMaterial) {
            console.log('Migrating database: Adding material column to products...');
            db.exec("ALTER TABLE products ADD COLUMN material TEXT");
            
            // Seed material data for existing products
            const materialMap = {
                'Superfine Chenille Carpet': 'Chenille',
                'Urban Arc Modern Area Rug': 'Synthetic',
                'Royal Heritage Persian Rug': 'Wool',
                'Hand-Knotted Kashan Rug': 'Wool',
                'Minimalist Geometry Rug': 'Synthetic',
                'Plush Bedroom Shag Rug': 'Cotton',
                'Masterpiece Silk Inlaid Rug': 'Silk',
                'Traditional Isfahan Rug': 'Wool'
            };
            
            const updateMaterial = db.prepare('UPDATE products SET material = ? WHERE name = ?');
            const updateMany = db.transaction(() => {
                for (const [name, material] of Object.entries(materialMap)) {
                    updateMaterial.run(material, name);
                }
            });
            updateMany();
            console.log('Migration complete: Material data seeded for all products.');
        }

        // Seed products if table is empty
        const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
        if (productCount.count === 0) {
            console.log('Seeding initial products...');
            const insertProduct = db.prepare(`
                INSERT INTO products (name, sku, category, description, price, image, rating, stock, isFeatured) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const initialProducts = [
                ["Superfine Chenille Carpet", "RUG-001", "Living Room", "Experience luxury and comfort with the plush, modern Superfine Chenille Carpet.", 12499, "/bestseller1.png", 5, 25, 1],
                ["Urban Arc Modern Area Rug", "RUG-002", "Modern", "A contemporary abstract rug with soft neutral tones and bold curves.", 18990, "/bestseller2.png", 4, 15, 0],
                ["Royal Heritage Persian Rug", "RUG-003", "Traditional", "A richly detailed Persian-inspired rug featuring classic motifs and warm colors.", 85000, "/bestseller3.png", 5, 5, 1],
                ["Hand-Knotted Kashan Rug", "RUG-004", "Traditional", "Authentic hand-knotted Kashan rug from master weavers using organic dyes.", 125000, "/traditionalRug.png", 5, 2, 0],
                ["Minimalist Geometry Rug", "RUG-005", "Modern", "Perfect for office spaces or minimalist homes. Durable and easy to clean.", 8500, "/modernRug.png", 4, 40, 0],
                ["Plush Bedroom Shag Rug", "RUG-006", "Bedroom", "Soft underfoot, perfect for waking up to a cozy morning.", 6900, "/bedroomRug.png", 4, 10, 0],
                ["Masterpiece Silk Inlaid Rug", "RUG-007", "Living Room", "Luxury rug features silk inlaid borders for a shimmering, premium finish.", 245000, "/handmadeRug.png", 5, 1, 0],
                ["Traditional Isfahan Rug", "RUG-008", "Traditional", "Classical Isfahan design, perfect for dining rooms or formal halls.", 115000, "/livingRoomRug.png", 5, 8, 0]
            ];
            
            const insertMany = db.transaction((products) => {
                for (const product of products) insertProduct.run(...product);
            });
            insertMany(initialProducts);
        }

        // Seed coupons if table is empty
        const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons').get();
        if (couponCount.count === 0) {
            console.log('Seeding initial coupons...');
            const insertCoupon = db.prepare(`
                INSERT INTO coupons (code, discountType, discountValue, expiryDate, isActive) 
                VALUES (?, ?, ?, ?, ?)
            `);
            
            const initialCoupons = [
                ["HERITAGE10", "percentage", 10, "2026-12-31", 1],
                ["WELCOME20", "percentage", 20, "2026-12-31", 1]
            ];
            
            const insertManyCoupons = db.transaction((coupons) => {
                for (const coupon of coupons) insertCoupon.run(...coupon);
            });
            insertManyCoupons(initialCoupons);
        }

        return db;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const db = connectDB();

module.exports = db;
