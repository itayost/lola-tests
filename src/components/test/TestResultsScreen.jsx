import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const TestResultsScreen = ({ name, score, totalQuestions, onBack }) => (
  <Card>
    <CardHeader>
      <CardTitle>Test Complete</CardTitle>
      <CardDescription>
        Thank you for completing the test, {name}!
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center space-y-4">
        <p className="text-2xl font-bold">
          Your Score: {score.toFixed(1)}%
        </p>
        <p>
          You answered {Math.round((score / 100) * totalQuestions)} out of {totalQuestions} questions correctly.
        </p>
        <div className="space-x-2">
          <Button onClick={onBack}>Back to Home</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Take Another Test
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TestResultsScreen;