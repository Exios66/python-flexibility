import React, { useState } from 'react';
import Home from './Home';
import QuizApp from './QuizApp';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizCompleted(false);
  };

  const handleQuizComplete = (score, total) => {
    setFinalScore({ score, total });
    setQuizCompleted(true);
    setShowQuiz(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {!showQuiz && !quizCompleted && (
        <Home darkMode={darkMode} startQuiz={startQuiz} />
      )}
      {showQuiz && (
        <QuizApp darkMode={darkMode} toggleDarkMode={toggleDarkMode} onComplete={handleQuizComplete} />
      )}
      {quizCompleted && (
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-center p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg mb-4">Your final score: {finalScore.score} out of {finalScore.total}</p>
            <p className="text-lg mb-4">Accuracy: {((finalScore.score / finalScore.total) * 100).toFixed(2)}%</p>
            <Button onClick={startQuiz} variant={darkMode ? 'outline' : 'default'}>
              Take Quiz Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
