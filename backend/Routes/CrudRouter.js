
const { addQues, getQues, deleteQues, updateQues, getAllQues } = require('../Controllers/CrudController');
const { authMiddleware } = require('../Middlewares/AuthValidation');
const { addQuestionValidation } = require('../Middlewares/CrudValidation');


const router = require('express').Router();

router.post('/addQues',authMiddleware,addQuestionValidation, addQues);

router.get('/getQues',getQues);

router.delete('/deleteQues/:quesId',authMiddleware,deleteQues);

router.put('/updateQues/:quesId',authMiddleware, updateQues);

router.get('/getAllQues', getAllQues);

module.exports = router;