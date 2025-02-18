const AdminModel = require('./models/adminModel');
const pool = require('./config/database');

async function testAdminFunctions() {
    try {
        console.log('Admin panel testi başlıyor...');

        // Test 1: İstatistikleri al
        const stats = await AdminModel.getStats();
        console.log('Genel İstatistikler:', stats);

        // Test 2: Yeni kategori ekle
        const categoryId = await AdminModel.addCategory('Meslekler', 'M');
        console.log('Yeni kategori eklendi, ID:', categoryId);

        // Test 3: Yeni kelime ekle
        const wordId = await AdminModel.addWord('mühendis', categoryId);
        console.log('Yeni kelime eklendi, ID:', wordId);

        // Test 4: Tüm kategorileri listele
        const categories = await AdminModel.listCategories();
        console.log('Kategoriler:', categories);

        // Test 5: Belirli kategorideki kelimeleri listele
        const words = await AdminModel.listWords(categoryId);
        console.log('Kategorideki kelimeler:', words);

    } catch (error) {
        console.error('Test sırasında hata:', error);
    } finally {
        await pool.end();
    }
}

testAdminFunctions();