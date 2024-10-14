const express = require('express');
const { signupSession, loginSession, AreIamAuthenticated, logout } = require('../db/Controlers/authController.js');
const { verification } = require('../db/Controlers/vertactionController.js');

const router = express.Router();

router.post('/signup', signupSession);
router.post('/login', loginSession);
router.post('/AreIamAuthenticated', AreIamAuthenticated);
router.post('/logout', logout);
router.post('/verification', verification);

module.exports = router;