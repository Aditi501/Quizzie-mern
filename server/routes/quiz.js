const express=require('express');
const router=express.Router();
const quizController =require('../controller/quiz');
const verifyToken=require('../middleware/verifyToken');
const {submitAnswers} = require('../controller/answers');


router.post('/create',verifyToken,quizController.createQuiz);
router.get('/get',quizController.getAllQuiz);
router.get('/get/:id',quizController.getQuizById);
router.post('/submit', submitAnswers)
router.get('/getByUserId',verifyToken,quizController.getQuizByUserId)
router.put('/update', verifyToken,quizController.updateQuiz)
router.get('/total',verifyToken,quizController.getAggregatedStats)
router.delete('/delete/:id',verifyToken,quizController.deleteQuiz)
module.exports=router