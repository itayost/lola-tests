// pages/TestPage.jsx
import React, { useState, useEffect } from 'react';
import { TestSelection } from '../components/test/TestSelection';
import PracticeTest from '../components/test/PracticeTest';
import RealTest from '../components/test/RealTest';
import { getTestConfig, defaultConfig } from '../services/test-config';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const TestPage = ({ onBack }) => {
  const [testType, setTestType] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const testConfig = await getTestConfig();
        setConfig(testConfig);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleTestSelect = (type) => {
    setTestType(type);
    // Scroll to top when changing views
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (testType) {
      setTestType(null);
    } else {
      onBack();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading test information...</p>
          </CardContent>
        </Card>
      );
    }

    if (!testType) {
      return (
        <TestSelection 
          onSelect={handleTestSelect}
          onBack={onBack}
        />
      );
    }

    if (testType === 'practice') {
      // Practice test uses simplified config
      const practiceConfig = {
        ...config,
        timeLimit: 30, // Fixed 30 minutes for practice
        numberOfQuestions: 10, // Fixed 10 questions for practice
        passingScore: 0 // No passing score for practice
      };
      
      return (
        <PracticeTest
          config={practiceConfig}
          onBack={() => setTestType(null)}
        />
      );
    }

    return (
      <RealTest
        onBack={() => setTestType(null)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goBack}
              className="mr-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {!testType 
                  ? 'Test Selection'
                  : testType === 'practice' 
                    ? 'Practice Test'
                    : 'Official Assessment'}
              </h1>
              <p className="text-sm text-gray-500">
                {!testType 
                  ? 'Choose the type of test you want to take'
                  : testType === 'practice' 
                    ? 'Practice without affecting your record'
                    : 'Complete this assessment to test your knowledge'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!testType && (
          <Card className="mb-6 border-blue-100 bg-blue-50">
            <CardContent className="p-4 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About the tests</p>
                <p className="text-blue-700">
                  Practice tests allow you to familiarize yourself with the format without affecting your record. 
                  Official assessments are recorded and require a passing score of {config.passingScore}%.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default TestPage;