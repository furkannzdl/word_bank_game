const pool = require('../config/database');
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const AdminController = require('../controllers/adminController');

// İstatistikler
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM categories) as total_categories,
                (SELECT COUNT(*) FROM words) as total_words,
                (SELECT COUNT(*) FROM rooms) as total_games
        `);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
});

// Kategorileri listele
router.get('/categories', adminAuth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Kategoriler alınamadı' });
    }
});

router.get('/categories/:id', adminAuth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Kategori bulunamadı' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Kategori alınamadı' });
    }
});

// Bir kategorinin kelimelerini getir
router.get('/categories/:id/words', adminAuth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM words WHERE category_id = ? ORDER BY id DESC',
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Kelimeler alınamadı' });
    }
});


// Kategoriye kelime ekleme
router.post('/categories/:id/words', adminAuth, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { word } = req.body;

        // Aynı kelimeden var mı kontrol et
        const [existingWords] = await pool.query(
            'SELECT * FROM words WHERE word = ? AND category_id = ?',
            [word.toLowerCase(), categoryId]
        );

        if (existingWords.length > 0) {
            return res.status(400).json({ error: 'Bu kelime zaten mevcut' });
        }

        // Yeni kelimeyi ekle
        const [result] = await pool.query(
            'INSERT INTO words (word, category_id) VALUES (?, ?)',
            [word.toLowerCase(), categoryId]
        );

        res.status(201).json({
            id: result.insertId,
            word: word.toLowerCase(),
            category_id: categoryId
        });
    } catch (error) {
        console.error('Kelime ekleme hatası:', error);
        res.status(500).json({ error: 'Kelime eklenemedi' });
    }
});

// Kelime sil
router.delete('/words/:id', adminAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM words WHERE id = ?', [req.params.id]);
        res.json({ message: 'Kelime silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Kelime silinemedi' });
    }
});

// Yeni kategori ekle
router.post('/categories', adminAuth, async (req, res) => {
    try {
        const { name, starting_letter } = req.body;
        const [result] = await pool.query(
            'INSERT INTO categories (name, starting_letter) VALUES (?, ?)',
            [name, starting_letter]
        );
        res.status(201).json({ id: result.insertId, name, starting_letter });
    } catch (error) {
        res.status(500).json({ error: 'Kategori eklenemedi' });
    }
});

module.exports = router;