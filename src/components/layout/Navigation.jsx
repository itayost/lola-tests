import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ClipboardList, Settings, Home } from 'lucide-react';

const Navigation = ({ onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-800">Lola Training</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            className="flex items-center text-md px-4 py-2 transition-all hover:scale-105 hover:bg-blue-700" 
            onClick={() => onNavigate('test')}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Take a Test
          </Button>
          <Button 
            className="flex items-center text-md px-4 py-2 border transition-all hover:scale-105 hover:bg-gray-200"
            variant="outline"
            onClick={() => onNavigate('admin')}
          >
            <Settings className="mr-2 h-5 w-5" />
            Admin Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
