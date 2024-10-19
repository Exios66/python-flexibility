import React, { useState, useEffect } from 'react';
import { Moon, Sun, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const QuizApp = ({ darkMode, toggleDarkMode, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(30);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch and randomize questions
    const fetchQuestions = async () => {
      // In a real app, this would be an API call
      const fetchedQuestions = [
        {
          question: "What is the definition of misinformation?",
          choices: [
            "False or inaccurate information",
            "False news",
            "True news",
            "Propaganda"
          ],
          correctAnswer: "False or inaccurate information"
        },
        {
          question: "What is the Dunning-Kruger effect?",
          choices: [
            "A cognitive bias where people with low ability overestimate their ability",
            "A tendency to overestimate others' competence",
            "A method for estimating knowledge",
            "A way to improve skills"
          ],
          correctAnswer: "A cognitive bias where people with low ability overestimate their ability"
        },
        {
          question: "What is cherry-picking in propaganda?",
          choices: [
            "Selecting only favorable evidence",
            "Presenting all evidence",
            "Ignoring contradictory evidence",
            "Appealing to emotions"
          ],
          correctAnswer: "Selecting only favorable evidence"
        },
        {
          question: "What is the bandwagon effect?",
          choices: [
            "Adopting beliefs because others do",
            "Being skeptical of common beliefs",
            "Standing by personal beliefs",
            "Resisting popular opinions"
          ],
          correctAnswer: "Adopting beliefs because others do"
        }
      ];
      setQuestions(fetchedQuestions.sort(() => Math.random() - 0.5));
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !showScore) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      handleAnswerSubmit();
    }
  }, [timer, showScore]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    const currentQuestionData = questions[currentQuestion];
    if (selectedAnswer === currentQuestionData.correctAnswer) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback('Correct!');
    } else {
      setStreak(0);
      setFeedback('Incorrect. The correct answer was: ' + currentQuestionData.correctAnswer);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer('');
      setTimer(30);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowScore(false);
    setTimer(30);
    setStreak(0);
    setFeedback('');
    setQuestions(questions.sort(() => Math.random() - 0.5));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quiz App</h1>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-4 w-4" />
          </div>
        </div>

        {!showScore ? (
          <Card className={`w-full max-w-2xl mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(timer / 30) * 100} className="mb-4" />
              <p className="text-lg mb-4">{questions[currentQuestion]?.question}</p>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                {questions[currentQuestion]?.choices.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={choice} id={`choice-${index}`} />
                    <Label htmlFor={`choice-${index}`}>{choice}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div>Time left: {timer}s</div>
              <Button onClick={handleAnswerSubmit} variant={darkMode ? 'outline' : 'default'}>
                Submit <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className={`w-full max-w-2xl mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">Your score: {score} out of {questions.length}</p>
              <p className="text-lg mb-4">Accuracy: {((score / questions.length) * 100).toFixed(2)}%</p>
              <p className="text-lg mb-4">Highest streak: {streak}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={restartQuiz} variant={darkMode ? 'outline' : 'default'}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Restart Quiz
              </Button>
              <Button onClick={() => onComplete(score, questions.length)} variant={darkMode ? 'outline' : 'default'}>
                Finish <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {feedback && (
          <Alert className={`mt-4 ${feedback.startsWith('Correct') ? (darkMode ? 'bg-green-900' : 'bg-green-100') : (darkMode ? 'bg-red-900' : 'bg-red-100')}`}>
            <AlertCircle className={`h-4 w-4 ${feedback.startsWith('Correct') ? 'text-green-600' : 'text-red-600'}`} />
            <AlertTitle>{feedback.startsWith('Correct') ? 'Correct!' : 'Incorrect'}</AlertTitle>
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
