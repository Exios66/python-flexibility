import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';

const TOTAL_QUESTIONS = 10;

function Quiz() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [highestDifficulty, setHighestDifficulty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/question?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }
      const data = await response.json();
      setQuestion(data);
      setStartTime(Date.now());
      setTotalQuestions(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000;
    setAvgTime(prev => (prev * (totalQuestions - 1) + timeSpent) / totalQuestions);

    try {
      const response = await fetch('/api/check_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: selectedAnswer, correct_answer: question.correct_answer }),
      });
      if (!response.ok) {
        throw new Error('Failed to check answer');
      }
      const data = await response.json();

      updateGameState(data.correct);

      if (totalQuestions >= TOTAL_QUESTIONS) {
        await submitQuiz();
      } else {
        fetchQuestion();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const updateGameState = (isCorrect) => {
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
      if (difficulty < 2) setDifficulty(prev => prev + 1);
    } else {
      setStreak(0);
      if (difficulty > 0) setDifficulty(prev => prev - 1);
    }
    setHighestDifficulty(Math.max(highestDifficulty, difficulty));
    setSelectedAnswer('');
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch('/api/submit_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streak,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          avg_time_per_question: avgTime,
          highest_difficulty: highestDifficulty,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }
      const data = await response.json();
      navigate('/results', { state: data });
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Progress value={(totalQuestions / TOTAL_QUESTIONS) * 100} className="mb-4" />
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer} className="mb-4">
          {question.choices.map((choice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={choice} id={`choice-${index}`} />
              <Label htmlFor={`choice-${index}`}>{choice}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleSubmit} disabled={!selectedAnswer}>Submit Answer</Button>
      </Card>
      <div className="mt-4 text-sm text-gray-600">
        <p>Current Streak: {streak}</p>
        <p>Difficulty: {difficulty}</p>
        <p>Questions Answered: {totalQuestions} / {TOTAL_QUESTIONS}</p>
      </div>
    </div>
  );
}

export default Quiz;
