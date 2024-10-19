import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const QuizUI = () => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);


  const fetchQuestion = useCallback(async () => {
    try {
      const response = await axios.get('/api/question');
      setQuestion(response.data.question);
      setChoices(response.data.choices);
      setIsCorrect(null);
      setSelectedAnswer('');
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await axios.post('/api/check_answer', {
        answer: selectedAnswer,
        correct_answer: choices[0], // Assuming the first choice is always the correct one
      });
      setIsCorrect(response.data.correct);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const handleNextQuestion = () => {
    fetchQuestion();
  };

  return (
    <div className="quiz-container">
      <h2>{question}</h2>
      <ul>
        {choices.map((choice, index) => (
          <li key={choice}>
            <label htmlFor={`choice-${index}`}>
              <input
                id={`choice-${index}`}
                type="radio"
                value={choice}
                checked={selectedAnswer === choice}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              />
              {choice}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>Submit Answer</button>
      {isCorrect !== null && (
        <div>
          <p>{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </div>
  );
};

export default QuizUI;
