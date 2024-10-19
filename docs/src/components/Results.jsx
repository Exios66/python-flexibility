import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, Target, User, Award } from 'lucide-react';

function Results() {
  const location = useLocation();
  const { score_category, time_feedback, accuracy, user_id, streak, highest_difficulty } = location.state;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Excellent':
        return 'bg-green-500';
      case 'Good':
        return 'bg-blue-500';
      case 'Average':
        return 'bg-yellow-500';
      case 'Needs Improvement':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6" />
              <span className="font-semibold">Score Category:</span>
            </div>
            <Badge className={`${getCategoryColor(score_category)} text-white`}>
              {score_category}
            </Badge>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-6 h-6" />
              <span className="font-semibold">Accuracy:</span>
            </div>
            <Progress value={accuracy} className="w-full" />
            <p className="text-right mt-1">{accuracy}%</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6" />
              <span className="font-semibold">Time Feedback:</span>
            </div>
            <span>{time_feedback}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6" />
              <span className="font-semibold">User ID:</span>
            </div>
            <span>{user_id}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">Longest Streak:</span>
            <span>{streak}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">Highest Difficulty Reached:</span>
            <span>{highest_difficulty}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/">
            <Button size="lg">Back to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Results;
