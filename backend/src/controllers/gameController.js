const GameModel = require('../models/gameModel');

class GameController {
    async createRoom(req, res) {
        try {
            const { categoryId } = req.body;
            const userId = req.user.id; // JWT'den gelecek

            const roomCode = await GameModel.createRoom(categoryId, userId);
            res.json({ roomCode });
        } catch (error) {
            res.status(500).json({ error: 'Oda oluşturulurken hata oluştu' });
        }
    }

    async joinRoom(req, res) {
        try {
            const { roomCode } = req.body;
            const userId = req.user.id;

            const room = await GameModel.joinRoom(roomCode, userId);
            res.json({ room });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async submitWord(req, res) {
        try {
            const { word, categoryId } = req.body;
            const isValid = await GameModel.checkWord(word, categoryId);
            
            res.json({ isValid });
        } catch (error) {
            res.status(500).json({ error: 'Kelime kontrolünde hata oluştu' });
        }
    }
}

module.exports = new GameController();