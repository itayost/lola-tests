// components/admin/TestResultsList.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  Search,
  Calendar,
  UserCircle,
  Trophy,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { getTestResults } from '../../services/test-results';

const TestResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedResult, setExpandedResult] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const fetchedResults = await getTestResults();
      setResults(fetchedResults);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortResults = (resultsToSort) => {
    return [...resultsToSort].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle special cases
      if (sortField === 'timestamp') {
        valueA = new Date(valueA || 0);
        valueB = new Date(valueB || 0);
      }
      
      // Compare
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredResults = sortResults(
    results.filter(result => 
      result.waiterName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleExpand = (resultId) => {
    setExpandedResult(expandedResult === resultId ? null : resultId);
  };

  const exportToCsv = () => {
    if (filteredResults.length === 0) return;
    
    const headers = ['Name', 'Date', 'Score', 'Questions Correct', 'Total Questions', 'Pass/Fail'];
    const rows = filteredResults.map(result => [
      result.waiterName,
      new Date(result.timestamp).toLocaleString(),
      result.score + '%',
      result.correctAnswers,
      result.totalQuestions,
      result.score >= 70 ? 'PASS' : 'FAIL'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `test_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button onClick={loadResults} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={exportToCsv}
          disabled={filteredResults.length === 0}
          className="shrink-0"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-xl">Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">
                    <Button 
                      variant="ghost" 
                      className="px-2 flex items-center"
                      onClick={() => handleSort('waiterName')}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      <span>Name</span>
                      {sortField === 'waiterName' && (
                        <ChevronUp 
                          className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                            sortDirection === 'desc' ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 text-left">
                    <Button 
                      variant="ghost" 
                      className="px-2 flex items-center"
                      onClick={() => handleSort('timestamp')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Date</span>
                      {sortField === 'timestamp' && (
                        <ChevronUp 
                          className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                            sortDirection === 'desc' ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 text-left">
                    <Button 
                      variant="ghost" 
                      className="px-2 flex items-center"
                      onClick={() => handleSort('score')}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>Score</span>
                      {sortField === 'score' && (
                        <ChevronUp 
                          className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                            sortDirection === 'desc' ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </Button>
                  </th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <React.Fragment key={result.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-4 font-medium">{result.waiterName}</td>
                      <td className="py-4">{new Date(result.timestamp).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.score >= 70 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.score?.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(result.id)}
                          className="ml-auto"
                        >
                          {expandedResult === result.id ? (
                            <>Hide <ChevronUp className="ml-1 h-4 w-4" /></>
                          ) : (
                            <>View <ChevronDown className="ml-1 h-4 w-4" /></>
                          )}
                        </Button>
                      </td>
                    </tr>
                    {expandedResult === result.id && (
                      <tr>
                        <td colSpan={4} className="py-4 px-4 bg-gray-50">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded border">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Score</h3>
                                <p className="text-2xl font-bold">{result.score?.toFixed(1)}%</p>
                              </div>
                              <div className="bg-white p-4 rounded border">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Correct Answers</h3>
                                <p className="text-2xl font-bold">{result.correctAnswers} / {result.totalQuestions}</p>
                              </div>
                              <div className="bg-white p-4 rounded border">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Result</h3>
                                <p className="text-2xl font-bold">
                                  {result.score >= 70 ? (
                                    <span className="text-green-600">Pass</span>
                                  ) : (
                                    <span className="text-red-600">Fail</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            {result.answersData && (
                              <div className="mt-4">
                                <h3 className="font-medium mb-2">Question Details</h3>
                                <div className="space-y-2">
                                  {result.answersData.map((answer, index) => (
                                    <div key={index} className="bg-white border rounded p-3">
                                      <div className="flex items-start">
                                        {answer.selectedAnswer === answer.correctAnswer ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                                        ) : (
                                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 shrink-0" />
                                        )}
                                        <div>
                                          <p className="font-medium">Q{index + 1}: {answer.questionText}</p>
                                          <p className="text-sm text-gray-600 mt-1">
                                            {answer.selectedAnswer === answer.correctAnswer 
                                              ? "Correct" 
                                              : `Incorrect - Answered: ${answer.options[answer.selectedAnswer]}`}
                                          </p>
                                          {answer.selectedAnswer !== answer.correctAnswer && (
                                            <p className="text-sm text-green-600 mt-1">
                                              Correct answer: {answer.options[answer.correctAnswer]}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      {searchTerm ? 'No results matching your search' : 'No test results available yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultsList;