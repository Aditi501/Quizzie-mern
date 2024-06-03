import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Analysis.module.css';
import Home from '../Home/Home';
import Dashboard from '../Dashboard/Dashboard';

const Analysis = () => {
  const { fetchQuizData } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const id=localStorage.getItem('QuesAnalysisId');
  

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetchQuizData(id);
        setQuiz(response);
        console.log(response)
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching analysis data:', error);
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options).split(' ');
    return `${formattedDate[0]} ${formattedDate[1]}, ${formattedDate[2]}`

  };

  
  

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
    <Home/>
    {quiz.quiz.type=== 'Q & A' ?(
        <div className={styles.analysisContainer}>
          <div className={styles.Box}>
          <h2>{quiz.quiz.title} Analysis</h2>
          <p style={{color:"#FF5D01"}}>Created on: {formatDate(quiz.quiz.createdAt)}<br/>
          impressions: {quiz.quiz.impressions}</p>
          </div>
          {quiz.questionsAnalysis.map((question, index) => (
           <div key={index} className={styles.questionAnalysis}>
           <h3>Q.{index+1} {question.text}</h3>
           <div className={styles.detailsTotal}>
           <div className={styles.total}>
            <h2>{question.totalAttempts}</h2>
            <h5>people Attempted the question</h5>
            </div>
           <div className={styles.total}>
            <h2>{question.correctAttempts}</h2>
            <h5>people Answered Correctly</h5>
            </div>
           <div className={styles.total}>
            <h2>{question.incorrectAttempts}</h2>
            <h5>people Answered Incorrectly</h5>
            </div>
           </div>
           </div>
          ))}
          
        </div>
    ):
    <div className={styles.analysisContainer}>
          <div className={styles.Box}>
          <h2>{quiz.quiz.title} Analysis</h2>
          <p style={{color:"#FF5D01"}}>Created on: {formatDate(quiz.quiz.createdAt)}<br/>
          impressions: {quiz.quiz.impressions}</p>
          </div>
          {quiz.quiz.questions.map((question, index) => (
           <div key={index} className={styles.questionAnalysis}>
           <h3>Q.{index+1} {question.text}</h3>
           <div className={styles.detailsTotal}>
           {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className={styles.total1}>
                  <h2>{option.attempts.length}</h2>
                  <span>option {optionIndex+1}</span>
                </div>
              ))}
           </div>
           </div>
          ))}
          
        </div>
  }
    </>
  );
};

export default Analysis;
