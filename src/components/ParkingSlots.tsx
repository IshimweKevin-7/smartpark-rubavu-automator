
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Square } from 'lucide-react';

const ParkingSlots = ({ parkingManager }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        setLoading(true);
        const slotsData = [];
        
        for (let i = 1; i <= 50; i++) {
          const carInfo = await parkingManager.getSlotInfo(i);
          slotsData.push({
            number: i,
            occupied: carInfo !== null,
            car: carInfo
          });
        }
        
        setSlots(slotsData);
      } catch (error) {
        console.error('Error loading slots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [parkingManager]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
          Loading parking slots...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Occupied</span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {slots.map((slot) => (
          <Card 
            key={slot.number}
            className={`p-2 text-center relative cursor-pointer transition-all hover:scale-105 ${
              slot.occupied 
                ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                : 'bg-green-100 border-green-300 hover:bg-green-200'
            }`}
            title={slot.occupied ? `${slot.car.plateNumber} - ${slot.car.ownerName}` : `Slot ${slot.number} - Available`}
          >
            <div className="flex flex-col items-center space-y-1">
              {slot.occupied ? (
                <Car className="h-4 w-4 text-red-600" />
              ) : (
                <Square className="h-4 w-4 text-green-600" />
              )}
              <span className="text-xs font-medium">{slot.number}</span>
              {slot.occupied && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {slot.car.plateNumber.slice(-3)}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Click on any slot to see details. Red slots are occupied, green slots are available.</p>
      </div>
    </div>
  );
};

export default ParkingSlots;
