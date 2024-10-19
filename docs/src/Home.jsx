import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Quiz App</h1>
      <p className="mb-4">Test your knowledge with our adaptive quiz!</p>
      <Link to="/quiz">
        <Button>Start Quiz</Button>
      </Link>
    </div>
  );
}

export default Home;
