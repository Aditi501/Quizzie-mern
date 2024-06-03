const User = require('../model/user');
const Quiz = require('../model/quiz');

const submitAnswers = async (req, res) => {
    const { quizId, answers } = req.body;
    const userId = req.user ? req.userId : null;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;

        let totalQuizAttempts = 0;
        let totalQuizCorrectAttempts = 0;
        let totalQuizIncorrectAttempts = 0;

        if (quiz.type === 'Q & A') {
            quiz.questions.forEach((question, index) => {
                const selectedOptionIndex = answers[index];
                if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
                    const selectedOption = question.options[selectedOptionIndex];

                    question.totalAttempts++;
                    totalQuizAttempts++;

                    if (userId) {
                        selectedOption.attempts.push(userId);
                    }  else {
                      selectedOption.attempts.push(1);  
                  }

                    if (question.answer == selectedOptionIndex) { 
                        score++;
                        question.correctAttempts++;
                        totalQuizCorrectAttempts++;
                    } else {
                        question.incorrectAttempts++;
                        totalQuizIncorrectAttempts++;
                    }
                }
            });
        }
        else if (quiz.type === 'Poll') {
          quiz.questions.forEach((question, index) => {
            const selectedOptionIndex = answers[index];
            if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
                const selectedOption = question.options[selectedOptionIndex];

               selectedOption.attempts.push(userId ? userId : 1);}})
      }
        const questionsAnalysis = quiz.questions.map(question => ({
          id: question._id,
          text: question.questionText,
          totalAttempts: question.totalAttempts,
          correctAttempts: question.correctAttempts,
          incorrectAttempts: question.incorrectAttempts
      }));

      
      quiz.questionsAnalysis = questionsAnalysis;
        await quiz.save();

        if (userId) {
            const user = await User.findById(userId);
            user.responses.push({ quizId, answers, score });
            await user.save();
        }



        res.json({
            score,
            questionsAnalysis,
            totalQuizAttempts,
            totalQuizCorrectAttempts,
            totalQuizIncorrectAttempts
        });

    } catch (err) {
        res.status(500).json({ message: 'Error submitting answers: ' + err.message });
    }
};

module.exports = { submitAnswers };
