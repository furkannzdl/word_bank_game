// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Pool'u import ediyoruz

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const [users] = await pool.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );

            const user = users[0];
            
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username },
                'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({ 
                token, 
                username: user.username,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    }

    async register(req, res) {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await pool.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword]
            );

            res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanılıyor' });
            }
            res.status(500).json({ error: 'Kayıt olurken bir hata oluştu' });
        }
    }
}

module.exports = new AuthController();