
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

const CarExitForm = ({ onSubmit, parkedCars, disabled = false }) => {
  const [selectedCar, setSelectedCar] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCar && !disabled) {
      onSubmit(selectedCar);
      setSelectedCar('');
    }
  };

  if (parkedCars.length === 0) {
    return (
      <Card className="p-6 bg-gray-50 border-gray-200">
        <p className="text-gray-600 text-center">
          No cars currently parked
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="carSelect">Select Car to Exit</Label>
        <Select value={selectedCar} onValueChange={setSelectedCar} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a car..." />
          </SelectTrigger>
          <SelectContent>
            {parkedCars.map((car) => (
              <SelectItem key={car.plateNumber} value={car.plateNumber}>
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium">{car.plateNumber}</span>
                  <span className="text-sm text-gray-500 ml-4">
                    Slot {car.slotNumber} - {car.ownerName}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!selectedCar || disabled}
        variant="destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {disabled ? 'Processing...' : 'Exit Car'}
      </Button>
    </form>
  );
};

export default CarExitForm;
