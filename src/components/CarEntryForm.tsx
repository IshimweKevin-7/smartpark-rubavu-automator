
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Car } from 'lucide-react';

const CarEntryForm = ({ onSubmit, disabled }) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (plateNumber.trim() && ownerName.trim()) {
      onSubmit({ plateNumber: plateNumber.trim().toUpperCase(), ownerName: ownerName.trim() });
      setPlateNumber('');
      setOwnerName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plateNumber">Car Plate Number</Label>
        <Input
          id="plateNumber"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="e.g., RAD 123A"
          required
          disabled={disabled}
          className="uppercase"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input
          id="ownerName"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          placeholder="Enter owner's name"
          required
          disabled={disabled}
        />
      </div>

      {disabled && (
        <Card className="p-3 bg-red-50 border-red-200">
          <p className="text-red-600 text-sm text-center">
            Parking is full! No available slots.
          </p>
        </Card>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={disabled || !plateNumber.trim() || !ownerName.trim()}
      >
        <Car className="mr-2 h-4 w-4" />
        {disabled ? 'Parking Full' : 'Enter Car'}
      </Button>
    </form>
  );
};

export default CarEntryForm;
