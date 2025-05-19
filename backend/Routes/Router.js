const { signup, login, addQues } = require('../Controllers/Controller');
const { signupValidation, loginValidation, addQuestionValidation } = require('../Middlewares/Validation');

const router = require('express').Router();

router.post('/login', loginValidation, login);

router.post('/signup', signupValidation, signup);

router.post('/addQues',addQuestionValidation, addQues);

module.exports = router;