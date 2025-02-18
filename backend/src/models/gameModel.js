const pool = require('../config/database');

class GameModel {
    async createRoom(categoryId, creatorId) {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const [result] = await pool.execute(
            'INSERT INTO rooms (room_code, category_id) VALUES (?, ?)',
            [roomCode, categoryId]
        );
        
        await pool.execute(
            'INSERT INTO room_players (room_id, player_id) VALUES (?, ?)',
            [result.insertId, creatorId]
        );

        return roomCode;
    }

    async joinRoom(roomCode, playerId) {
        const [rooms] = await pool.execute(
            'SELECT * FROM rooms WHERE room_code = ? AND status = "waiting"',
            [roomCode]
        );
    
        if (rooms.length === 0) {
            throw new Error('Oda bulunamadı veya dolu');
        }
    
        await pool.execute(
            'INSERT INTO room_players (room_id, player_id) VALUES (?, ?)',
            [rooms[0].id, playerId]
        );
    
        await pool.execute(
            'UPDATE rooms SET status = "playing" WHERE id = ?',
            [rooms[0].id]
        );
    
        return rooms[0];
    }

    async checkWord(word, categoryId) {
        const [result] = await pool.execute(
            'SELECT * FROM words WHERE word = ? AND category_id = ?',
            [word.toLowerCase(), categoryId]
        );
        return result.length > 0;
    }
}

module.exports = new GameModel();