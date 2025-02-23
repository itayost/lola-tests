import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const TestStartScreen = ({ name, setName, error, loading, onBack, startTest }) => (
  <Card>
    <CardHeader>
      <CardTitle>Start Test</CardTitle>
      <CardDescription>Please enter your name to begin</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <Input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        onKeyPress={(e) => e.key === 'Enter' && startTest()}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="space-x-2">
        <Button onClick={onBack} variant="outline" disabled={loading}>
          Back
        </Button>
        <Button 
          onClick={startTest}
          disabled={loading || !name.trim()}
        >
          {loading ? 'Loading...' : 'Start Test'}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TestStartScreen;