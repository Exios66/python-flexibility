import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';

function Results() {
  const location = useLocation();
  const { score_category, time_feedback, accuracy, user_id } = location.state;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="mb-2">Score Category: {score_category}</p>
        <p className="mb-2">Accuracy: {accuracy}%</p>
        <p className="mb-2">Time Feedback: {time_feedback}</p>
        <p className="mb-4">User ID: {user_id}</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </Card>
    </div>
  );
}

export default Results;
