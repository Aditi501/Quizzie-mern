const Quiz=require('../model/quiz');

const createQuiz= async(req,res,next)=>{
    try
    {
        const { title, questions, type  } = req.body;
        const userId = req.userId

        if (!title || !questions ||!type) {
            return res.status(400).json("Please provide all the required fields");
        }
        const quiz = new Quiz({title , questions, type, creator: userId});
        await quiz.save();
        res.status(201).json({message:"Quiz created",quiz});
    }
    catch(error)
    {
        next(error);
    }
}
const getAllQuiz = async(req,res,next)=>{
    try
    {
        const { sort = 'impressions', limit = 12 } = req.query;
        const quiz= await Quiz.find().sort({ [sort]: -1 })
        .limit(parseInt(limit));
        res.json(quiz);
    }
    catch(error)
    {
        next(error);
    }
}
const getQuizById = async (req, res, next) => {
  try {
      const quiz = await Quiz.findById(req.params.id);

      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }

     
      quiz.impressions += 1;

     
   
      const questionsAnalysis = quiz.questions.map(question => ({
        id: question._id,
        text: question.questionText,
        totalAttempts: question.totalAttempts,
        correctAttempts: question.correctAttempts,
        incorrectAttempts: question.incorrectAttempts}))
        
  

      
      await quiz.save();

      res.json({
          quiz,
          questionsAnalysis
      });
  } catch (error) {
      next(error);
  }
};


const getQuizByUserId= async(req,res,next)=>{
    try
    {
        const userId=req.userId;
        const { sort = 'impressions', limit = 12 } = req.query;
        const quizzes = await Quiz.find({creator: userId}) .sort({ [sort]: -1 })
        .limit(parseInt(limit));
        for (const quiz of quizzes) {
            quiz.impressions += 1;
            await quiz.save();
          }
        res.json(quizzes);
    }
    catch(error)
    {
        next(error);
    }
}
const updateQuiz = async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const userId = req.userId;
      const { title, type, questions } = req.body;
      
      if (!title || !questions ||!type) {
        return res.status(400).json("Please provide all the required fields");
    }
      const quiz = await Quiz.findOne({ _id: quizId, creator: userId });
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found or you do not have permission to update it' });
      }
  
      await Quiz.updateOne({ _id: quizId, creator: userId }, {
        $set: {
            title, 
            type, 
            questions
        }
    })
    res.json({ message: "Quiz updated" })
    } catch (error) {
      next(error);
    }
  };

  const deleteQuiz = async (req, res, next) => {
    try {
      const quizId = req.params.id;
      const userId = req.userId; 
  
      
      const quiz = await Quiz.findOne({ _id: quizId, creator: userId });
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found or you do not have permission to delete it' });
      }
  
      
      await Quiz.deleteOne({ _id: quizId, creator: userId });
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  const getAggregatedStats = async (req, res, next) => {
    try {
      const userId = req.userId;
  
      const quizzes = await Quiz.find({ creator: userId });
  
      const totalQuizzes = quizzes.length;
      const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
      const totalImpressions = quizzes.reduce((acc, quiz) => acc + quiz.impressions, 0);
  
      res.json({
        totalQuizzes,
        totalQuestions,
        totalImpressions,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports={createQuiz,getAllQuiz,getQuizById,getQuizByUserId,updateQuiz,getAggregatedStats,deleteQuiz}