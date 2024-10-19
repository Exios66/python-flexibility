import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Home';
import QuizApp from './QuizApp';
import Results from './components/Results';
import NotFound from './components/NotFound';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [quizState, setQuizState] = useState({
    isActive: false,
    isCompleted: false,
    score: 0,
    total: 0,
    accuracy: 0,
    timeTaken: 0,
    difficulty: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const startQuiz = () => {
    setQuizState(prevState => ({
      ...prevState,
      isActive: true,
      isCompleted: false,
    }));
    toast({
      title: "Quiz Started",
      description: "Good luck!",
    });
  };

  const handleQuizComplete = (score, total, timeTaken, difficulty) => {
    const accuracy = total > 0 ? ((score / total) * 100).toFixed(2) : 0;
    setQuizState({
      isActive: false,
      isCompleted: true,
      score,
      total,
      accuracy,
      timeTaken,
      difficulty,
    });
    toast({
      title: "Quiz Completed",
      description: `You scored ${score} out of ${total}`,
    });
  };

  return (
    <ThemeProvider defaultTheme={darkMode ? 'dark' : 'light'}>
      <Router>
        <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home startQuiz={startQuiz} />} />
              <Route 
                path="/quiz" 
                element={
                  quizState.isActive ? (
                    <QuizApp 
                      darkMode={darkMode} 
                      toggleDarkMode={toggleDarkMode}
                      onComplete={handleQuizComplete}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/results" 
                element={
                  quizState.isCompleted ? (
                    <Results quizState={quizState} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
