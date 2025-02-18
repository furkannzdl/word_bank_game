const GameModel = require('./models/gameModel');
const pool = require('./config/database');

async function testGameFunctions() {
    try {
        // Test kullanıcısı ve kategori oluştur
        console.log('Test başlıyor...');
        
        // Test 1: Oda oluşturma
        const roomCode = await GameModel.createRoom(1, 1); // categoryId: 1, userId: 1
        console.log('Oda oluşturuldu:', roomCode);

        // Test 2: Odaya katılma
        const room = await GameModel.joinRoom(roomCode, 2); // userId: 2
        console.log('Odaya katılım:', room);

        // Test 3: Kelime kontrolü
        const isValidWord = await GameModel.checkWord('test', 1);
        console.log('Kelime kontrolü:', isValidWord);

    } catch (error) {
        console.error('Test sırasında hata:', error);
    } finally {
        await pool.end();
    }
}

testGameFunctions();