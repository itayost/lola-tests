import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

const Question = ({ question, onAnswer, questionNumber, totalQuestions, currentAnswer }) => {
  if (!question) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Question {questionNumber} of {totalQuestions}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg">{question.text}</p>
          <RadioGroup 
            value={currentAnswer !== undefined ? currentAnswer.toString() : undefined}
            onValueChange={(value) => onAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default Question;