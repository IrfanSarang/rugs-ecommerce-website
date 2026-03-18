const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async findOne({ email }) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);
        if (user) {
            user.matchPassword = async function (enteredPassword) {
                return await bcrypt.compare(enteredPassword, this.password);
            };
            user.matchAnswer = async function (enteredAnswer) {
                if (!this.securityAnswer) return false;
                return await bcrypt.compare(enteredAnswer.toLowerCase(), this.securityAnswer);
            };
        }
        return user;
    }

    static async create({ name, email, password, securityQuestion, securityAnswer }) {
        const salt = await bcrypt.genSalt(10);
        const hashedHeader = await bcrypt.hash(password, salt);

        let hashedAnswer = null;
        if (securityAnswer) {
            const answerSalt = await bcrypt.genSalt(10);
            hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), answerSalt);
        }

        const stmt = db.prepare(`
            INSERT INTO users (name, email, password, securityQuestion, securityAnswer)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(name, email, hashedHeader, securityQuestion || null, hashedAnswer || null);

        return {
            _id: result.lastInsertRowid,
            name,
            email,
            isAdmin: false
        };
    }

    static async findById(id) {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    }

    static async save(user) {
        // This is a simplified mock of Mongoose save for password reset
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const stmt = db.prepare('UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(hashedPassword, user.id);
    }
}

module.exports = User;
