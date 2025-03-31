// components/test/TestSelection.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Dumbbell, FileCheck, ArrowLeft } from 'lucide-react';

export const TestSelection = ({ onSelect, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-2">
              <Dumbbell className="h-6 w-6" />
            </div>
            <CardTitle>Practice Test</CardTitle>
            <CardDescription>
              Get comfortable with the format and questions
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>10 questions from the test bank</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Detailed explanations of correct answers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>No recording of results</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>30 minute time limit</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => onSelect('practice')}
            >
              Start Practice Test
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader className="pb-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white mb-2">
              <FileCheck className="h-6 w-6" />
            </div>
            <CardTitle>Official Assessment</CardTitle>
            <CardDescription>
              Take the official test to demonstrate your knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>15 questions from the test bank</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Results recorded in the system</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Certificate upon passing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Limited to one attempt per day</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => onSelect('real')}
            >
              Start Official Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 text-center">
        <Button 
          variant="ghost"
          onClick={onBack}
          className="inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};