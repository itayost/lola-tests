// components/test/TestReview.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import QuestionReview from './QuestionReview';

const TestReview = ({ questions, answers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions Review</CardTitle>
        <CardDescription>
          Review your answers and see the correct solutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionReview 
              key={index}
              question={question}
              questionIndex={index}
              userAnswer={answers[index]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestReview;