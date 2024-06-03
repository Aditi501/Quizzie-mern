import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
function Login() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors={}
    if (!email) errors.email = 'Email Required';
    if (!password) errors.password = 'Password Required';
    setErrors(errors);
    
    try {
      const {token,userId,username}=await loginUser({ email, password });
      console.log('Login successful:',token,userId,username);
      navigate('/home')
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder={errors.email ? errors.email : ''}  
        className={errors.email ? styles.invalid : ''} 
        />
        <label>Password</label>
        <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder={errors.password ? errors.password : ''}  
        className={errors.password ? styles.invalid : ''}   
        />
        <button className={styles.login} type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
