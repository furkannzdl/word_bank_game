const pool = require('../config/database');

class CategoryController {
    // Tüm kategorileri getir
    static async getCategories(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM categories');
            res.json(rows);
        } catch (error) {
            console.error('Kategoriler getirilirken hata:', error);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    }

    // Yeni kategori ekle
    static async addCategory(req, res) {
        const { name, starting_letter } = req.body;
        try {
            const [result] = await pool.execute(
                'INSERT INTO categories (name, starting_letter) VALUES (?, ?)',
                [name, starting_letter]
            );
            res.status(201).json({ message: 'Kategori eklendi', id: result.insertId });
        } catch (error) {
            console.error('Kategori eklenirken hata:', error);
            res.status(500).json({ error: 'Sunucu hatası' });
        }
    }
}

module.exports = CategoryController; // Controller'ı export edin