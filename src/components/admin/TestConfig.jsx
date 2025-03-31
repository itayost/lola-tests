// components/admin/TestConfig.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { saveTestConfig, getTestConfig, defaultConfig } from '../../services/test-config';
import { 
  Clock, 
  ClipboardList, 
  Percent, 
  Shuffle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

const TestConfig = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const currentConfig = await getTestConfig();
      setConfig(currentConfig);
    } catch (error) {
      console.error('Load config error:', error);
      setError('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    // Validate config values
    const validatedConfig = {
      ...config,
      timeLimit: Math.max(1, parseInt(config.timeLimit) || defaultConfig.timeLimit),
      numberOfQuestions: Math.max(1, parseInt(config.numberOfQuestions) || defaultConfig.numberOfQuestions),
      passingScore: Math.min(100, Math.max(0, parseInt(config.passingScore) || defaultConfig.passingScore)),
      randomizeQuestions: Boolean(config.randomizeQuestions)
    };

    try {
      await saveTestConfig(validatedConfig);
      setConfig(validatedConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Save config error:', error);
      setError('Failed to save configuration: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Configuration</CardTitle>
        <CardDescription>Configure test parameters and settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Label htmlFor="timeLimit" className="font-medium">Time Limit (minutes)</Label>
              </div>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={config.timeLimit}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  timeLimit: parseInt(e.target.value) || defaultConfig.timeLimit
                }))}
              />
              <p className="text-sm text-gray-500">
                How long users have to complete the test
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-gray-500" />
                <Label htmlFor="numberOfQuestions" className="font-medium">Number of Questions</Label>
              </div>
              <Input
                id="numberOfQuestions"
                type="number"
                min="1"
                value={config.numberOfQuestions}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  numberOfQuestions: parseInt(e.target.value) || defaultConfig.numberOfQuestions
                }))}
              />
              <p className="text-sm text-gray-500">
                How many questions to include in each test
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-500" />
                <Label htmlFor="passingScore" className="font-medium">Passing Score (%)</Label>
              </div>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={config.passingScore}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  passingScore: parseInt(e.target.value) || defaultConfig.passingScore
                }))}
              />
              <p className="text-sm text-gray-500">
                Minimum percentage required to pass the test
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Shuffle className="h-4 w-4 text-gray-500" />
                <Label htmlFor="randomize" className="font-medium">Randomize Question Order</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="randomize"
                  checked={config.randomizeQuestions}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    randomizeQuestions: checked
                  }))}
                />
                <Label htmlFor="randomize">
                  {config.randomizeQuestions ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-gray-500">
                Shuffle the order of questions for each test
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-600 text-sm">Configuration saved successfully!</p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={saving}
          className="w-full md:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : 'Save Configuration'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestConfig;