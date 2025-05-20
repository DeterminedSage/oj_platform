const { signup, login, addQues, getQues, deleteQues, updateQues } = require('../Controllers/Controller');
const { signupValidation, loginValidation, addQuestionValidation } = require('../Middlewares/Validation');

const router = require('express').Router();

router.post('/login', loginValidation, login);

router.post('/signup', signupValidation, signup);

router.post('/addQues',addQuestionValidation, addQues);

router.get('/getQues', getQues);

router.delete('/deleteQues/:quesId', deleteQues);

router.put('/updateQues/:quesId', updateQues);


module.exports = router;