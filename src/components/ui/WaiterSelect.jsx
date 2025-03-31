// components/ui/WaiterSelect.jsx
import React, { useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const WaiterSelect = ({ waiters, value, onSelect, placeholder = "Select a waiter" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedWaiter = waiters.find(w => w.id === value);

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedWaiter ? selectedWaiter.name : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-1">
            <div className="max-h-60 overflow-auto">
              {waiters.map(waiter => (
                <Button
                  key={waiter.id}
                  variant="ghost"
                  className="w-full justify-start mb-1"
                  onClick={() => {
                    onSelect(waiter.id);
                    setIsOpen(false);
                  }}
                >
                  {waiter.name}
                </Button>
              ))}
              {waiters.length === 0 && (
                <div className="text-center py-2 text-gray-500">
                  No waiters available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WaiterSelect;