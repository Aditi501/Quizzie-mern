import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Quiz.module.css';
import { useAuth } from '../../context/AuthContext';
import prize from '../../assets/image 2.png'

const Quiz = () => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isPollCompleted, setIsPollCompleted] = useState(null);
  const { fetchQuizData, userId, quiz, setQuiz } = useAuth();
  const quizId = localStorage.getItem('quizId');


  useEffect(() => {
    if (quiz.type === 'Q & A' && quiz.questions.length > 0) {
      const initialTimer = quiz.questions[currentQuestionIndex].timer;
      setTimeLeft(initialTimer === 0 ? null : initialTimer); 
    }
  }, [currentQuestionIndex, quiz.type, quiz.questions]);
  

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        console.log(`Fetching quiz data for quizId: ${quizId}`);
        const response = await fetchQuizData(quizId);
        if (response) {
          console.log('Quiz data fetched:', response);
          setQuiz(response.quiz);
          setAnswers(new Array(response.quiz.questions?.length || 0).fill(null));
          if (response.quiz.type === 'Q & A' && response.quiz.questions?.length > 0) {
            setTimeLeft(response.quiz.questions[0].timer || ''); 
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz.type === 'Q & A' && timeLeft === 0) {
      moveToNextQuestion();
    }
    if (quiz.type === 'Q & A' && timeLeft !== null) {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);}
  }, [timeLeft]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    const stringifiedAnswers = newAnswers.map(answer => String(answer));
    setAnswers(stringifiedAnswers);
    setSelected(optionIndex);
    console.log(stringifiedAnswers); 
  };

  // const moveToNextQuestion = () => {
  //   if (currentQuestionIndex < quiz.questions.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //     setTimeLeft(quiz.questions[currentQuestionIndex + 1].timer || 0);
  //     setSelected(null);
  //   } else {
  //     handleSubmit(); 
  //   }
  // };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextQuestionTimer = quiz.questions[currentQuestionIndex + 1].timer;

      console.log("Next question timer:", nextQuestionTimer);
      setTimeLeft(nextQuestionTimer === 0 || nextQuestionTimer === null ? null : nextQuestionTimer);

      console.log("Time left for next question:", timeLeft);
      setSelected(null);
    } else {
      handleSubmit(); 
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/quiz/submit', {
        quizId,
        userId,
        answers
      });
      console.log('Quiz submitted:', response.data);
      if (quiz.type === 'Q & A') {
        setIsQuizCompleted(true);
        setScore(response.data.score);
      }
      if (quiz.type === 'Poll') {
        setIsPollCompleted(true);
        console.log('Poll completed');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(quiz.questions)
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.quizContainer}>
        {(quiz.type === 'Q & A' && timeLeft > 0 ) && <div className={styles.timer}>{formatTime(timeLeft)}s</div>}
        <div className={styles.questionIndex}>
          {String(currentQuestionIndex + 1).padStart(2, '0')}/{String(quiz.questions.length).padStart(2, '0')}
        </div>
        <div className={styles.question}>
          <h3>{currentQuestion.questionText}</h3>
          <div className={styles.optionsGrid}>
            {currentQuestion.options.map((option, oIndex) => (
              <div
                key={oIndex}
                className={`${styles.option} ${selected === oIndex ? styles.selectedOption : ''}`}
                onClick={() => handleOptionChange(currentQuestionIndex, oIndex)}
              >
                {option.type === 'text' && <label>{option.text}</label>}
                {option.type === 'imageUrl' && <img src={option.imageUrl} alt="Option" />}
                {option.type === 'textImage' && <label className={styles.optionTextImage}><h5>{option.text}</h5><img src={option.imageUrl} alt="Option" /></label>}
              </div>
            ))}
          </div>
        </div>
        {currentQuestionIndex < quiz.questions.length - 1 && (
          <button onClick={moveToNextQuestion} className={styles.nextButton}>NEXT</button>
        )}
        {currentQuestionIndex === quiz.questions.length - 1 && (
          <button onClick={handleSubmit} className={styles.submitButton}>SUBMIT</button>
        )}
        {score !== null && <div className={styles.score}>Your score: {score}</div>}
        </div> 
       {isQuizCompleted &&(
        <div className={styles.completedQuiz}>
          <h3>Congrats Quiz is completed</h3>
          <img src={prize}/>
          <p>Your Score is <span style={{color:'#60B84B'}}>{String(score).padStart(2, '0')}</span><span style ={{color:'#60B84B'}}> / </span><span style ={{color:'#60B84B'}}>{String(quiz.questions.length).padStart(2, '0')}</span></p>
        </div>
        )}

        {isPollCompleted &&(
        <div className={styles.completedPoll}>
          <h3>Thank you for participating in the Poll</h3>
        </div>
        )}
    </div>
  )
};

export default Quiz;
