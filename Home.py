import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Home = ({ darkMode, startQuiz }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Card className={`w-full max-w-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome to the Quiz App</CardTitle>
          <CardDescription className="text-center">Test your knowledge on various topics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            This quiz will test your understanding of various concepts related to information literacy and critical thinking.
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Multiple choice questions</li>
            <li>Timed responses</li>
            <li>Instant feedback</li>
            <li>Track your score and streaks</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={startQuiz} variant={darkMode ? 'outline' : 'default'} size="lg">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
