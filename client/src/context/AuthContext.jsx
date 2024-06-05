import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'
const AuthContext = createContext();
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {

    const [userId, setUserId] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const[quizzes,setQuizzes]=useState([]);
    const [quiz,setQuiz]=useState([]);
    const [quizId,setQuizId]=useState('')
    const [aggregatedStats, setAggregatedStats] = useState({
        totalQuizzes: 0,
        totalQuestions: 0,
        totalImpressions: 0,
    });

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('userId');
        if (token && id) {
            setAuthToken(token);
            setUserId(id);
        }
        if(userId && authToken){
            fetchQuizById(userId);
            fetchAggregate(userId);
        }
       if(quizId){
        fetchQuizData(quizId)
       }
        fetchQuiz()
    }, []);

    useEffect(() => {
        fetchQuiz();
        if (authToken && userId) {
            fetchQuizById(userId);
            fetchAggregate(userId);
        }
    }, [authToken, userId]);


    useEffect(() => {
        setQuizId(localStorage.getItem('quizId'))
        if(quizId){
            fetchQuizData(quizId);
        }
    }, [quizId]);



    const registerUser= async({name,email,password,confirmPassword})=>{
        try{
            const response = await axios.post(`https://quizziebackend-w1h9.onrender.com/api/v1/auth/register`, {
                name,
                email,
                password,
                confirmPassword
            });
            
            console.log(response.data);
        }
        catch(error){
            console.log(error)
        }
    }

    const loginUser = async ({ email, password }) => {
        try {
            const reqUrl = `https://quizziebackend-w1h9.onrender.com/api/v1/auth/login`;
            
            const response = await axios.post(reqUrl, {email,password});
    
            localStorage.setItem('token',response.data.token);
            const decodedToken = jwtDecode(response.data.token);
            console.log(decodedToken);
            const userId = decodedToken.userId;
            const username=decodedToken.name;
            localStorage.setItem("userId", userId);
            localStorage.setItem("name", username);
            return { token: response.data.token, userId,username};
        } 
        catch (error) {
            console.log(error);
        }
    };

    const fetchQuizById=async(userId)=>{
            try {
            console.log(authToken)
              const response = await axios.get('https://quizziebackend-w1h9.onrender.com/api/v1/quiz/getByUserId',
              {headers: { Authorization: `${authToken}` }},{userId});
              setQuizzes(response.data);
              console.log(response.data);
            } catch (error) {
              console.log(error);
            }
    }

    const fetchQuizData = async (quizId) => {
        console.log('useEffect called',quizId);

        try {
            const response = await axios.get(`https://quizziebackend-w1h9.onrender.com/api/v1/quiz/get/${quizId}`);
            console.log(response.data)
            setQuiz(response.data.quiz);
            
            return response.data;
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      };
    const fetchQuiz= async()=>{
        try{
            const response = await axios.get('https://quizziebackend-w1h9.onrender.com/api/v1/quiz/get')
            setQuizzes(response.data)
        }
        catch(error){
            console.log(error)
        }
    }
    const fetchAggregate=async(userId)=>{
        try{
              const response = await axios.get('https://quizziebackend-w1h9.onrender.com/api/v1/quiz/total',
              {headers: { Authorization: `${authToken}` }},{userId});
              console.log('Aggregated Stats:', response.data);
              setAggregatedStats(response.data);
        }
        catch(error){
            console.log(error);
        }
    }
    return (
        <AuthContext.Provider value={{  
            registerUser,
            loginUser,
            fetchQuizById,
            quizzes,
            setQuizzes,
            userId,
            aggregatedStats,
            fetchAggregate,
            authToken,
            fetchQuizData,
            quiz,
            setQuiz,
            setQuizId
        }}
        >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);