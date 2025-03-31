// components/test/StartTest.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CheckCircle, Clock, AlertTriangle, FileQuestion, User } from 'lucide-react';

const StartTest = ({ name, onNameChange, onStart, loading, error, testConfig }) => {
  // Default config values in case they're not provided
  const timeLimit = testConfig?.timeLimit || 30;
  const questionCount = testConfig?.numberOfQuestions || 15;
  const passingScore = testConfig?.passingScore || 70;
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Ready to Begin Your Test</CardTitle>
          <CardDescription>Please read the instructions and enter your name to start</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test rules section */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileQuestion className="h-5 w-5 mr-2 text-blue-500" />
              Test Instructions
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Time Limit: {timeLimit} minutes</p>
                  <p className="text-sm text-gray-600">
                    The test will automatically submit when time runs out.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Questions: {questionCount} multiple choice</p>
                  <p className="text-sm text-gray-600">
                    You can navigate between questions and change your answers until you submit.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-3 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Passing Score: {passingScore}%</p>
                  <p className="text-sm text-gray-600">
                    You need to answer at least {Math.ceil((passingScore / 100) * questionCount)} questions correctly to pass.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Name input section */}
          <div className="pt-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              Enter your name
            </label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                disabled={loading}
                className="pl-4 pr-4 py-2 w-full"
              />
              {error && (
                <div className="mt-2 text-red-500 text-sm flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Please enter your name exactly as it appears in the system.
            </p>
          </div>
          
          {/* Additional information */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
            <p className="text-sm">
              <span className="font-medium">Important Note:</span> Once you start the test, make sure you complete it without refreshing or closing your browser. Your progress will be automatically saved.
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Back
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={onStart}
            disabled={loading || !name.trim()}
          >
            {loading ? 'Loading...' : 'Start Test Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartTest;