const UserModel = require('./models/userModel');
const pool = require('./config/database');

async function testDatabaseConnection() {
    try {
        // Veritabanı bağlantısını test et
        const [result] = await pool.execute('SELECT 1');
        console.log('Veritabanı bağlantısı başarılı!');

        // Kullanıcı oluşturmayı test et
        const userId = await UserModel.create('testuser', 'test123');
        console.log('Kullanıcı oluşturuldu, ID:', userId);

        // Kullanıcıyı bulmayı test et
        const user = await UserModel.findByUsername('testuser');
        console.log('Bulunan kullanıcı:', user);

    } catch (error) {
        console.error('Test sırasında hata:', error);
    } finally {
        // Bağlantı havuzunu kapat
        await pool.end();
    }
}

testDatabaseConnection();