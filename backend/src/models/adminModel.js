const pool = require('../config/database');

class AdminModel {
    async getStats() {
        const [stats] = await pool.execute(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM categories) as total_categories,
                (SELECT COUNT(*) FROM words) as total_words,
                (SELECT COUNT(*) FROM rooms) as total_games
        `);
        return stats[0];
    }

    async addCategory(name, startingLetter) {
        const [result] = await pool.execute(
            'INSERT INTO categories (name, starting_letter) VALUES (?, ?)',
            [name, startingLetter]
        );
        return result.insertId;
    }

    async addWord(word, categoryId) {
        const [result] = await pool.execute(
            'INSERT INTO words (word, category_id) VALUES (?, ?)',
            [word.toLowerCase(), categoryId]
        );
        return result.insertId;
    }

    async listCategories() {
        const [categories] = await pool.execute('SELECT * FROM categories');
        return categories;
    }

    async listWords(categoryId) {
        const [words] = await pool.execute(
            'SELECT * FROM words WHERE category_id = ?',
            [categoryId]
        );
        return words;
    }
}

module.exports = new AdminModel();