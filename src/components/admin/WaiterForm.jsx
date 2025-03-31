// components/admin/WaiterForm.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { addWaiter, updateWaiter } from '../../services/waiters';

export const WaiterForm = ({ waiter = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: waiter?.name || '',
    pin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate input
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);

    try {
      if (waiter?.id) {
        await updateWaiter(waiter.id, formData);
      } else {
        const result = await addWaiter(formData);
        console.log('Waiter added successfully:', result);
      }
      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{waiter ? 'Edit Waiter' : 'Add New Waiter'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Waiter's name"
              disabled={loading}
            />
          </div>
          {waiter && (
            <div className="text-sm text-gray-500">
              Employee ID: {waiter.employeeId}
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : (waiter ? 'Update' : 'Create')}
        </Button>
      </CardFooter>
    </Card>
  );
};