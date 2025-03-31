// components/admin/TestResults.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getTestResults } from '../../services/test-results';

export const TestResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const fetchedResults = await getTestResults();
      setResults(fetchedResults);
    } catch (error) {
      setError('Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading results...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{result.waiterName}</p>
                  <p className="text-sm text-gray-500">ID: {result.employeeId}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(result.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    Score: {result.score.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.correctAnswers} / {result.totalQuestions} correct
                  </p>
                </div>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <p className="text-center text-gray-500">No test results yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};