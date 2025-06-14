const { getUser } = require('../Controllers/ProfileController');
const { authMiddleware } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.get('/user', authMiddleware , getUser);

module.exports = router;