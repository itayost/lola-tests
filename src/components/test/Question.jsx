// components/test/Question.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup } from '../ui/radio-group';
import { Label } from '../ui/label';

const Question = ({ question, onAnswer, currentAnswer, questionNumber, totalQuestions }) => {
  if (!question) return null;

  return (
    <Card className="w-full border-0 shadow-md">
      <CardHeader className="pb-4 border-b bg-gray-50">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl">Question {questionNumber} of {totalQuestions}</span>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
            Select one answer
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <p className="text-lg font-medium">{question.text}</p>
          <RadioGroup 
            value={currentAnswer?.toString() || ""}
            onValueChange={(value) => onAnswer(parseInt(value))}
            className="space-y-4 mt-6"
          >
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 border rounded-lg p-4 transition-all cursor-pointer
                  ${currentAnswer === index 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'hover:bg-gray-50 hover:border-gray-300'}`}
                onClick={() => onAnswer(index)}
              >
                <div className={`flex items-center justify-center h-5 w-5 rounded-full border 
                  ${currentAnswer === index 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'}`}
                >
                  {currentAnswer === index && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <Label 
                  className={`flex-grow cursor-pointer ${currentAnswer === index ? 'font-medium' : ''}`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default Question;