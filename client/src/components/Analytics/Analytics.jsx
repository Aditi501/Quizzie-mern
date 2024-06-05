import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Analytics.module.css';
import edit from '../../assets/Vector (8).png';
import del from '../../assets/Vector (7).png';
import share from '../../assets/share.png';
import axios from 'axios';

const Analytics = () => {
  const { quizzes, fetchQuizById, userId, authToken} = useAuth();
  const [id,setId]=useState('');
    const [isDelete,setIsDelete]=useState(false);
  useEffect(() => {
    if (userId) {
      fetchQuizById(userId);
    }
  }, [userId]);

  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`https://quizziebackend-w1h9.onrender.com/api/v1/quiz/delete/${quizId}`,
      {headers: { Authorization: `${authToken}` }},{userId});
      setIsDelete(false);
      fetchQuizById(userId);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleEdit = (quizId) => {
    
  };

  const handleShare = (quizId) => {
    const quizLink = `https://cerulean-tanuki-814ab8.netlify.app/quiz/${quizId}`;
    navigator.clipboard.writeText(quizLink);
    alert('Quiz link copied to clipboard!');
  };

  const handleViewAnalysis = (quizId) => {
    setId(quizId);
    localStorage.setItem('QuesAnalysisId',quizId)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.analysis} style={{color:"#5076FF"}}>Quiz Analysis</h1>
      {isDelete && (
        <div className={styles.delModal}>
            <div className={styles.delContent}>
                <h5>Are you confirm you want to delete ?</h5>
                <div className={styles.btnflexBox}>
                    <button style={{background:"#FF4B4B",color:"white"}} onClick={()=>handleDelete(id)}>Confirm Delete</button>
                    <button style={{background:"white",color:"#474444",boxShadow:"0px 0px 15px 0px #00000040"}}
                     onClick={()=>setIsDelete(false)}>Cancel</button>
                    </div>
            </div>
        </div>
      )}
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
            <th>Question Wise Analysis</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz._id}>
              <td>{index + 1}</td>
              <td>{quiz.title}</td>
              <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
              <td>{quiz.impressions}</td>
              <td>
                <button className={styles.actionbtn} onClick={() => setId(quiz._id)}><img src={edit}/></button>
                <button className={styles.actionbtn} onClick={() => {setId(quiz._id);setIsDelete(true)}}><img src={del}/></button>
                <button className={styles.actionbtn} onClick={() => {setId(true);handleShare(quiz._id)}}><img src={share}/></button>
              </td>
              <td>
                <Link className={styles.linkQuesAnalysis} to={`/analysis/${quiz._id}`} onClick={() => handleViewAnalysis(quiz._id)}>Question Wise Analysis</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
