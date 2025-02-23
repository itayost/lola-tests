import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const HomePage = ({ onNavigate, currentUser }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {currentUser ? `Welcome, ${currentUser.name}!` : 'Welcome to Lola Tests'}
          </CardTitle>
          <CardDescription>
            {currentUser 
              ? 'Start a test from the navigation above.' 
              : 'Please login to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This portal allows staff members to take assessment tests and administrators 
            to manage questions and view results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;