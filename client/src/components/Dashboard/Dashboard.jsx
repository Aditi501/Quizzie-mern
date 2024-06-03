import React ,{useEffect,useState}from 'react'
import {useAuth} from '../../context/AuthContext';
import styles from './Dashboard.module.css'
import eye from '../../assets/views.png';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const {quizzes,aggregatedStats,fetchAggregate,userId,setQuizId}=useAuth();
    const navigate=useNavigate();
   
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options).split(' ');
      return `${formattedDate[0]} ${formattedDate[1]}, ${formattedDate[2]}`

    };

    const handleQuizClick = (quizId) => {
      localStorage.setItem('quizId',quizId)
     
      navigate(`/quiz/${quizId}`);
    };
  return (
    <div className={styles.dashboard}>
        <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <h3 style={{color:'#FF5D01'}}>{aggregatedStats.totalQuizzes}</h3>
          <p style={{color:'#FF5D01'}}>Quiz created</p>
        </div>
        <div className={styles.statBox}>
          <h3 style={{color:'#60B84B'}}>{aggregatedStats.totalQuestions}</h3>
          <p style={{color:'#60B84B'}}>questions created</p>
        </div>
        <div className={styles.statBox}>
          <h3 style={{color:'#5076FF'}}>{aggregatedStats.totalImpressions}</h3>
          <p style={{color:'#5076FF'}}>Total Impressions</p>
        </div>
      </div>
      <div className={styles.trending}>
        <h3>Trending Quizzes</h3>
        <div className={styles.quizList}>
          {quizzes.map((quiz, index) => (
            <div className={styles.quizCard} key={index}
            onClick={() => handleQuizClick(quiz._id)}
            >
              <h4>{quiz.title}</h4>
              <div className={styles.impressions}>
              <p>{quiz.impressions}</p>
                <img src={eye} alt="Impressions" />
              </div>
              <p className={styles.createdAt} style={{color:"#60B84B"}}>Created on: {formatDate(quiz.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard