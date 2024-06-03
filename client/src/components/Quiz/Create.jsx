import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Create.module.css';
import axios from 'axios';
import bin from '../../assets/Vector (7).png';
import SuccessModal from './SuccessModal';

const Create = ({ isOpen, onClose }) => {
  const { quizzes, setQuizzes, authToken ,setQuizId} = useAuth();
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quizLink, setQuizLink] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: [{ type: 'text', text: '' }], answer: '', timer: 0 }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

 

  const handleCreateQuiz = () => {
    if (quizName && quizType) {
      setShowQuestionForm(true);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleSaveQuiz = async () => {
    const quizData = {
      title: quizName,
      type: quizType,
      questions: questions
    };
    console.log(authToken);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/quiz/create', quizData, {
        headers: { Authorization: `${authToken}` }
      });
      setQuizzes((prevQuizzes) => [...prevQuizzes, response.data]);
      const currentUrl = window.location.href;
      const generatedLink = `http://localhost:5173/quiz/${response.data.quiz._id}`;
      setQuizLink(generatedLink);
      setQuizId(response.data.quiz._id);
      localStorage.setItem('quizId',response.data.quiz._id)
      console.log(response.data)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleOptionSelect = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answer = oIndex;
    setQuestions(newQuestions);
  };

  

  const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: [{ type: 'text', text: '',imageUrl:'', textImage:''}], answer: '', timer: 0 }]);
      };
    
      const updateQuestionText = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = text;
        setQuestions(newQuestions);
      };
    
    const updateOptionText = (qIndex, oIndex, field, text) => {
        const newQuestions = [...questions];
        if (field === 'text') {
          newQuestions[qIndex].options[oIndex].text = text;
        } else if (field === 'imageUrl') {
          newQuestions[qIndex].options[oIndex].imageUrl = text;
        }
        setQuestions(newQuestions);
      };
    
    
    const updateOptionType = (qIndex, type) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.map(option => ({
          ...option,
          type: type
        }));
        setQuestions(newQuestions);
      };


    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        const optionType = newQuestions[qIndex].options[0].type;
        const newOption = { type: optionType, text: '' };
        if (optionType === 'textImage') {
          newOption.imageUrl = '';
        }
        newQuestions[qIndex].options.push(newOption);
        setQuestions(newQuestions);
      };
    
      const deleteOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length > 1) {
          newQuestions[qIndex].options.splice(oIndex, 1);
          setQuestions(newQuestions);
        } else {
          alert('At least one option is required.');
        }
      };
    

    const deleteQuestion = (qIndex) => {
        const newQuestions = [...questions];
        if (newQuestions.length > 1) {
          newQuestions.splice(qIndex, 1);
          setQuestions(newQuestions);
          if (currentSlide >= newQuestions.length) {
            setCurrentSlide(newQuestions.length - 1);
          }
        } else {
          alert('At least one question is required.');
        }
      };
    
      const updateAnswer = (qIndex, answer) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answer = answer;
        setQuestions(newQuestions);
      };
    
      const updateTimer = (qIndex, timer) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].timer = timer;
        setQuestions(newQuestions);
      };
      const handleAddSlide = () => {
        if (questions.length < 5) {
          const initialOptions = quizType === 'Poll' ? [{ type: 'text', text: '',imageUrl:'',textImage:'' }, { type: 'text', text: '',imageUrl:'',textImage:'' }] : [{ type: 'text', text: '' }];
          setQuestions([...questions, { questionText: '', options: initialOptions, answer: '', timer: 0 }]);
          setCurrentSlide(questions.length);
        }
      };
    
      const handleNextSlide = () => {
        if (currentSlide < questions.length - 1) {
          setCurrentSlide(currentSlide + 1);
        }
      };
    
      const handlePreviousSlide = () => {
        if (currentSlide > 0) {
          setCurrentSlide(currentSlide - 1);
        }
      };
  return (
    <>
     {showSuccessModal && (
        <SuccessModal 
          isOpenModal={showSuccessModal} 
          link={quizLink} 
          onCloseModal={onClose} 
        />
      )}
    <div className={styles.modalOverlay}
     onClick={onClose}
     style={{ display: showSuccessModal? 'none' : '' }}
    >
      <div className={`${styles.modalContent} ${showQuestionForm ? styles.large : styles.small}`} onClick={(e) => e.stopPropagation()}>
        {!showQuestionForm ? (
          <>
            <input
              className={styles.quizName}
              type="text"
              placeholder="Quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
            <div className={styles.quizTypeContainer}>
              <p>Quiz Type</p>
              <label>
                <input
                  type="button"
                  className={quizType === 'Q & A' ? styles.selected : styles.notSelected}
                  value="Q & A"
                  onClick={() => setQuizType('Q & A')}
                />
              </label>
              <label>
                <input
                  type="button"
                  className={quizType === 'Poll' ? styles.selected : styles.notSelected}
                  value="Poll"
                  onClick={() => setQuizType('Poll')}
                />
              </label>
            </div>
            <div className={styles.modalActions}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleCreateQuiz}>Continue</button>
            </div>
          </>
        ) : (
          <>


<div className={styles.containerEdit}>
              <div className={styles.slideButtons}>
                {questions.map((_, index) => (
                  <div key={index} className={styles.slideButtonContainer}>
                    <button onClick={() => setCurrentSlide(index)}>
                      {index + 1}
                    </button>
                    {questions.length > 1 && index > 0 && (
                        <h4
                        src=''
                          className={styles.deleteQuestionButton}
                          onClick={() => deleteQuestion(currentSlide)}
                        >X</h4>
                    )}
                  </div>
                ))}
                <h4 className={styles.addSlide} onClick={handleAddSlide}>+</h4>
              </div>
            </div>

            {questions.length > 0 && (
              <div className={`${styles.questionContainer} ${quizType === 'Poll' ? styles.pollQuestionContainer : styles.pollQuestionContainer}`}>
                <input
                  type="text"
                  placeholder={`Question ${currentSlide + 1}`}
                  value={questions[currentSlide].questionText}
                  onChange={(e) => updateQuestionText(currentSlide, e.target.value)}
                />
                
                
        <div className={styles.optionTypeContainer}>
            Option Type
             <label>
             <input
                type="radio"
                name={`optionType-${currentSlide}`}
                checked={questions[currentSlide].options[0].type === 'text'}
                onChange={() => updateOptionType(currentSlide, 'text')}
                id="text"
             />
        </label>Text
        <label>
             <input
                type="radio"
                name={`optionType-${currentSlide}`}
                checked={questions[currentSlide].options[0].type === 'imageUrl'}
                onChange={() => updateOptionType(currentSlide, 'imageUrl')}
            />
        </label>Image URL
        <label>
            <input
                type="radio"
                name={`optionType-${currentSlide}`}
                checked={questions[currentSlide].options[0].type === 'textImage'}
                onChange={() => updateOptionType(currentSlide, 'textImage')}
            />
        </label>Text & Image URL
    </div>

                {quizType === 'Q & A' ? (
                    <>
                  <div className={styles.optionsContainer}>
                    {questions[currentSlide].options.map((option, oIndex) => (
                      <div key={oIndex} className={styles.option}>
                        <input
                          type="radio"
                          name={`option-${currentSlide}`}
                          checked={questions[currentSlide].answer === oIndex}
                          onChange={() => handleOptionSelect(currentSlide, oIndex)}
                        />

                       {option.type === 'textImage' ? (
                            <div className={styles.textImage}>
                              <input
                                type="text"
                                placeholder={`Option ${oIndex + 1} Text`}
                                value={option.text}
                                onChange={(e) => updateOptionText(currentSlide, oIndex,'text', e.target.value)}
                                className={questions[currentSlide].answer === oIndex ? styles.selectedInput : styles.unselectedInput}
                              />
                              <input
                                type="text"
                                placeholder={`Option ${oIndex + 1} Image URL`}
                                value={option.imageUrl}
                                onChange={(e) => updateOptionText(currentSlide, oIndex, 'imageUrl', e.target.value)}
                                className={questions[currentSlide].answer === oIndex ? styles.selectedInput : styles.unselectedInput}
                              />
                            </div>
                          ) : (
                            <div className={styles.other}>
                            <input
                              type="text"
                              placeholder={`Option ${oIndex + 1}`}
                              value={option.text}
                              onChange={(e) => updateOptionText(currentSlide, oIndex, 'text', e.target.value)}
                              className={questions[currentSlide].answer === oIndex ? styles.selectedInput : styles.unselectedInput}
                            />
                            </div>
                          )}


                        {questions[currentSlide].options.length > 2 && oIndex>1  && (
                          <button
                            type="button"
                            className={styles.deleteOptionButton}
                            onClick={() => deleteOption(currentSlide, oIndex)}
                          >
                            <img src={bin} alt="delete option" />
                          </button>
                        )}
                      </div>
                    ))}
                    <div className={styles.addOptionContainer}>
                      {questions[currentSlide].options.length < 4 && (
                        <button
                          type="button"
                          className={styles.addOptionButton}
                          onClick={() => addOption(currentSlide)}
                        >Add Options
                        </button>
                      )}
                    </div>
                  </div>
                  </>
                ):

                <>
                <div className={styles.optionsContainer}>
                  {questions[currentSlide].options.map((option, oIndex) => (
                    <div key={oIndex} className={styles.option}>
                      <input
                        type="radio"
                        name={`option-${currentSlide}`}
                        checked={questions[currentSlide].answer === oIndex}
                        onChange={() => handleOptionSelect(currentSlide, oIndex)}
                      />

                     {option.type === 'textImage' ? (
                          <div className={styles.textImage}>
                            <input
                              type="text"
                              placeholder={`Option ${oIndex + 1} Text`}
                              value={option.text}
                              onChange={(e) => updateOptionText(currentSlide, oIndex,'text', e.target.value)}
                              className={questions[currentSlide].answer === oIndex ? styles.selectedInput : styles.unselectedInput}
                            />
                            <input
                              type="text"
                              placeholder={`Option ${oIndex + 1} Image URL`}
                              value={option.imageUrl}
                              onChange={(e) => updateOptionText(currentSlide, oIndex, 'imageUrl', e.target.value)}
                              className={questions[currentSlide].answer === oIndex ? styles.selectedInput : styles.unselectedInput}
                            />
                          </div>
                        ) : (
                          <div className={styles.other}>
                          <input
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option.text}
                            onChange={(e) => updateOptionText(currentSlide, oIndex, 'text', e.target.value)}
                            className={questions[currentSlide].answer === oIndex ? styles.selectedInput : styles.unselectedInput}
                          />
                          </div>
                        )}


                      {questions[currentSlide].options.length > 2 && oIndex>1  && (
                        <button
                          type="button"
                          className={styles.deleteOptionButton}
                          onClick={() => deleteOption(currentSlide, oIndex)}
                        >
                          <img src={bin} alt="delete option" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className={styles.addOptionContainer}>
                    {questions[currentSlide].options.length < 4 && (
                      <button
                        type="button"
                        className={styles.addOptionButton}
                        onClick={() => addOption(currentSlide)}
                      >Add Options
                      </button>
                    )}
                  </div>
                </div>
                </>
                }
                { quizType==='Q & A' &&(
                <div className={styles.timerContainer}>
                   <p>Timer</p>
  <label>
    <input
      type="button"
      name={`timer${currentSlide}`}
      value="OFF"
      className={questions[currentSlide].timer === 0 ? styles.selectedButton : styles.notSelected}
      onClick={() => updateTimer(currentSlide, 0)}
    />
  </label>
  <label>
    <input
      type="button"
      name={`timer${currentSlide}`}
      value="5 sec"
      className={questions[currentSlide].timer === 5 ? styles.selectedButton : styles.notSelected}
      onClick={() => updateTimer(currentSlide, 5)}
    />
  </label>
  <label>
    <input
      type="button"
      name={`timer${currentSlide}`}
      value="10 sec"
      className={questions[currentSlide].timer === 10 ? styles.selectedButton : styles.notSelected}
      onClick={() => updateTimer(currentSlide, 10)}
    />
  </label>
</div>)}

    </div>
                
             
        )}  
            <div className={styles.modalActions}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSaveQuiz}>Create Quiz</button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Create;

