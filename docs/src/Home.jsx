import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui/card';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Brain, Book, Trophy } from 'lucide-react';

function Home() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const features = [
    { icon: <Brain className="w-6 h-6" />, title: 'Adaptive Difficulty', description: 'Questions adjust to your skill level' },
    { icon: <Book className="w-6 h-6" />, title: 'Various Topics', description: 'Test your knowledge across multiple subjects' },
    { icon: <Trophy className="w-6 h-6" />, title: 'Track Progress', description: 'See your improvement over time' },
  ];

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'dark' : ''}`}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Welcome to the Quiz App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">Challenge yourself with our adaptive quiz and expand your knowledge!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                {feature.icon}
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Link to="/quiz">
            <Button size="lg">Start Quiz</Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Home;
