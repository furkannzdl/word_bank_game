const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController'); // Controller'ı import edin
const verifyToken = require('../middleware/verifyToken'); // Eğer token doğrulama kullanıyorsanız


// Tüm kategorileri getir
router.get('/categories', verifyToken, CategoryController.getCategories);

// Yeni kategori ekle
router.post('/categories', verifyToken, CategoryController.addCategory);

module.exports = router;