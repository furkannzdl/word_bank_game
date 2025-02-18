const AdminModel = require('../models/adminModel');

class AdminController {
    async getDashboardStats(req, res) {
        try {
            const stats = await AdminModel.getStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: 'İstatistikler alınamadı' });
        }
    }

    async addCategory(req, res) {
        try {
            const { name, startingLetter } = req.body;
            const categoryId = await AdminModel.addCategory(name, startingLetter);
            res.json({ message: 'Kategori eklendi', categoryId });
        } catch (error) {
            res.status(500).json({ error: 'Kategori eklenemedi' });
        }
    }

    async addWord(req, res) {
        try {
            const { word, categoryId } = req.body;
            const wordId = await AdminModel.addWord(word, categoryId);
            res.json({ message: 'Kelime eklendi', wordId });
        } catch (error) {
            res.status(500).json({ error: 'Kelime eklenemedi' });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await AdminModel.listCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Kategoriler alınamadı' });
        }
    }

    async getWords(req, res) {
        try {
            const { categoryId } = req.params;
            const words = await AdminModel.listWords(categoryId);
            res.json(words);
        } catch (error) {
            res.status(500).json({ error: 'Kelimeler alınamadı' });
        }
    }
}

module.exports = new AdminController();