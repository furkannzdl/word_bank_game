const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Token bulunamadı' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        
        // Kullanıcının admin olup olmadığını kontrol et
        const [users] = await pool.query(
            'SELECT * FROM users WHERE id = ? AND role = "admin"',
            [decoded.userId]
        );

        if (users.length === 0) {
            throw new Error();
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Yetkilendirme başarısız' });
    }
};

module.exports = adminAuth;