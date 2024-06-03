import React ,{useState} from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import styles from './Form.module.css';
const Form = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [isLoginClicked, setIsLoginClicked] = useState(false);
    const [isRegisterClicked, setIsRegisterClicked] = useState(false);

  const toggleForm = (form) => {
    setActiveForm(form);
    if (form === 'login') {
        setIsLoginClicked(true);
        setIsRegisterClicked(false);
      } else if (form === 'register') {
        setIsRegisterClicked(true);
        setIsLoginClicked(false);
      }
  };
  return (
    <div className={styles.container}>
        <h3 className={styles.title}>QUIZZIE</h3>
        {activeForm === 'login' ? <Login /> : <Register />}
        <div className={styles.btn}>
        <button className={isRegisterClicked ? styles.clicked : ''} onClick={() => toggleForm('register')}>Sign Up</button>
        <button className={isLoginClicked ? styles.clicked : ''} onClick={() => toggleForm('login')}>Log In</button>
        </div>
    </div>
  )
}

export default Form