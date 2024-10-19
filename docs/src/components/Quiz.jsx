import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

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
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestion();
  }, [difficulty]);

  const fetchQuestion = async () => {
    const response = await fetch(`/api/question?difficulty=${difficulty}`);
    const data = await response.json();
    setQuestion(data);
    setStartTime(Date.now());
    setTotalQuestions(prev => prev + 1);
  };

  const handleSubmit = async () => {
    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000;
    setAvgTime(prev => (prev * (totalQuestions - 1) + timeSpent) / totalQuestions);

    const response = await fetch('/api/check_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: selectedAnswer, correct_answer: question.correct_answer }),
    });
    const data = await response.json();

    if (data.correct) {
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
      if (difficulty < 2) setDifficulty(prev => prev + 1);
    } else {
      setStreak(0);
      if (difficulty > 0) setDifficulty(prev => prev - 1);
    }

    setHighestDifficulty(Math.max(highestDifficulty, difficulty));

    if (totalQuestions >= 10) {
      submitQuiz();
    } else {
      fetchQuestion();
    }
  };

  const submitQuiz = async () => {
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
    const data = await response.json();
    navigate('/results', { state: data });
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Progress value={(totalQuestions / 10) * 100} className="mb-4" />
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
        <RadioGroup onValueChange={setSelectedAnswer} className="mb-4">
          {question.choices.map((choice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={choice} id={`choice-${index}`} />
              <Label htmlFor={`choice-${index}`}>{choice}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleSubmit} disabled={!selectedAnswer}>Submit Answer</Button>
      </Card>
    </div>
  );
}

export default Quiz;
