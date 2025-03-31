import React from 'react';
import { Utensils } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded mr-3">
            <Utensils className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Lola Tests</h1>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          Staff Training Platform
        </div>
      </div>
    </header>
  );
};

export default Header;