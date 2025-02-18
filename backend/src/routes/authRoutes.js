const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));

module.exports = router;