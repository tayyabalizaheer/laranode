const express = require('express');
const router = express.Router();

var HomeController = require('../controllers/home');
var AuthController = require('../controllers/auth');

var LoginValidator = require('../validators/login');
var RegisterValidator = require('../validators/register');
var Auth = require('../middleware/auth');

router.get('/', Auth, HomeController.index);
router.get('/login', [], AuthController.login);
router.post('/login', LoginValidator, AuthController.loginPost);
router.get('/logout', AuthController.logout);
router.get('/register', [], AuthController.register);
router.post('/register', RegisterValidator, AuthController.registerPost);


router.get('/dashboard', Auth, HomeController.index);


module.exports = router;