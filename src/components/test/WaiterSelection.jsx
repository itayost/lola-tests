// components/test/WaiterSelection.jsx - Enhanced to integrate with RealTest
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getAllWaiters, canTakeTest } from '../../services/waiters';

export const WaiterSelection = ({ onSelect, onBack, autoStartTest = false }) => {
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWaiters();
  }, []);

  const loadWaiters = async () => {
    try {
      const fetchedWaiters = await getAllWaiters();
      setWaiters(fetchedWaiters);
    } catch (error) {
      setError('Failed to load waiters list');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (waiter) => {
    if (!canTakeTest(waiter)) {
      setError(`${waiter.name} has already taken a test today. Please try again tomorrow.`);
      return;
    }
    
    // Pass the entire waiter object to the parent component
    onSelect(waiter);
    
    // If autoStartTest is true, don't require any additional confirmations
    if (autoStartTest) {
      console.log("Auto-starting test after waiter selection");
    }
  };

  const filteredWaiters = waiters.filter(waiter => 
    waiter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading waiters...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Name</CardTitle>
        <CardDescription>Choose your name from the list to begin the test</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        
        <div className="max-h-64 overflow-y-auto border rounded-md divide-y">
          {filteredWaiters.map((waiter) => {
            const canTakeTestToday = canTakeTest(waiter);
            return (
              <div
                key={waiter.id}
                className={`p-3 ${canTakeTestToday ? 'cursor-pointer hover:bg-gray-50' : 'opacity-60 bg-gray-50'}`}
                onClick={() => canTakeTestToday ? handleSelect(waiter) : null}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{waiter.name}</p>
                  {!canTakeTestToday && (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                      Already taken today
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          {filteredWaiters.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "No matches found" : "No waiters available"}
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
      </CardContent>
    </Card>
  );
};