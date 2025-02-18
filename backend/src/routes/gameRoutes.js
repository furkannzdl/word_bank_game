const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

// Kategorileri getir
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Kategori getirme hatası:', error);
        res.status(500).json({ error: 'Kategoriler alınamadı' });
    }
});

// Oda oluştur
router.post('/create-room', async (req, res) => {
    try {
        const { categoryId } = req.body;
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const [result] = await pool.query(
            'INSERT INTO rooms (room_code, category_id, status) VALUES (?, ?, "waiting")',
            [roomCode, categoryId]
        );

        res.json({ roomCode, roomId: result.insertId });
    } catch (error) {
        console.error('Oda oluşturma hatası:', error);
        res.status(500).json({ error: 'Oda oluşturulamadı' });
    }
});

// Odaya katılma
router.post('/join-room', async (req, res) => {
    try {
        const { roomCode } = req.body;
        
        const [rooms] = await pool.query(
            'SELECT r.*, c.name as category_name, c.starting_letter FROM rooms r JOIN categories c ON r.category_id = c.id WHERE r.room_code = ? AND r.status = "waiting"',
            [roomCode]
        );

        if (rooms.length === 0) {
            return res.status(404).json({ success: false, error: 'Oda bulunamadı veya dolu' });
        }

        // Odanın durumunu güncelle
        await pool.query(
            'UPDATE rooms SET status = "playing" WHERE room_code = ?',
            [roomCode]
        );

        res.json({ 
            success: true, 
            category: {
                id: rooms[0].category_id,
                name: rooms[0].category_name,
                starting_letter: rooms[0].starting_letter
            }
        });
    } catch (error) {
        console.error('Odaya katılma hatası:', error);
        res.status(500).json({ success: false, error: 'Odaya katılınamadı' });
    }
});

module.exports = router;