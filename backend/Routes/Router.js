const { signup, login, addQues, getQues, deleteQues, updateQues, getAllQues } = require('../Controllers/Controller');
const { signupValidation, loginValidation, addQuestionValidation } = require('../Middlewares/Validation');

const router = require('express').Router();

router.post('/login', loginValidation, login);

router.post('/signup', signupValidation, signup);

router.post('/addQues',addQuestionValidation, addQues);

router.get('/getQues', getQues);

router.delete('/deleteQues/:quesId', deleteQues);

router.put('/updateQues/:quesId', updateQues);

router.get('/getAllQues', getAllQues);

// router.post('/run', executeCode);



module.exports = router;