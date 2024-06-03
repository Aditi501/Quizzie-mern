import React ,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Dashboard from '../Dashboard/Dashboard';
import Create from '../Quiz/Create'
import Analytics from '../Analytics/Analytics';
const Home = () => {
    
    const [activeComponent, setActiveComponent] = useState('Dashboard');
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate=useNavigate();
    const handleOpenModal = () => setModalOpen(true);

    const handleCloseModal = () => { 
       setModalOpen(false)
       navigate('/home')
      };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Analytics':
                return <Analytics />;
            case 'Create':
                return  <Create isOpen={isModalOpen} onClose={handleCloseModal} />;
            default:
                return <Dashboard />;
        }
    };
  return (
    <div className={styles.homePage}>
      <nav className={styles.sidebar}>
      <div>
          <Link className={styles.brand} to="/home">QUIZZIE</Link>
        </div>
        <ul>
          <li className={activeComponent === 'Dashboard' ? styles.active : ''} onClick={() => setActiveComponent('Dashboard')}>
                        Dashboard
                    </li>
                    <li className={activeComponent === 'Analytics' ? styles.active : ''} onClick={() => setActiveComponent('Analytics')}>
                        Analytics
                    </li>
                    <li className={activeComponent === 'CreateQuiz' ? styles.active : ''} onClick={() => {setActiveComponent('CreateQuiz');handleOpenModal()}}>
                        Create Quiz
                    </li>
                    <hr />
                    <li className={styles.logout}>
                        <a href="/" onClick={() => localStorage.clear()}>Logout</a>
                    </li>
        </ul>
      </nav>
      <main className={styles.content}>
      {renderComponent()}
        { activeComponent === 'Dashboard' && <Dashboard/>}
        {/* {activeComponent === 'CreateQuiz' &&  <Create isOpen={isModalOpen} onClose={handleCloseModal} />} */}
        {isModalOpen && <Create isOpen={isModalOpen} onClose={handleCloseModal} />}
      </main>
    </div>
  );
};

export default Home;
