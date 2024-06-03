import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Register.module.css'

function Register() {

  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!name) errors.name = 'Invalid Name';
    if (!email) errors.email = 'Invalid Email';
    if (!password) errors.password = 'Weak Password';
    if (!confirmPassword) errors.confirmPassword = 'password doesn’t match';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
    try {
      await registerUser({ name, email, password, confirmPassword });
      console.log('Registration successful');
      
    } catch (error) {
      console.error('Registration failed:', error);
      
    }
  }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          placeholder={errors.name ? errors.name : '' }
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? styles.invalid : ''}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder={errors.email ? errors.email : ''} 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? styles.invalid : ''} 
        />
        <label>Password</label>
        <input 
          type="password" 
          placeholder={errors.password ? errors.password : ''} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? styles.invalid : ''}  
        />
        <label>Confirm Password</label>
        <input 
          type="password"  
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className={errors.confirmPassword ? styles.invalid : ''}
        />
        <button className={styles.register} type="submit">Sign-Up</button>
      </form>
    </div>
  );
}

export default Register;
