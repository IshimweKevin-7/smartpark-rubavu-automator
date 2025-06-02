
import React, { useState, useEffect } from 'react';
import { Car, Clock, DollarSign, MapPin, Plus, Minus, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CarEntryForm from '@/components/CarEntryForm';
import CarExitForm from '@/components/CarExitForm';
import ParkingSlots from '@/components/ParkingSlots';
import ReceiptDisplay from '@/components/ReceiptDisplay';
import ComplexityAnalysis from '@/components/ComplexityAnalysis';
import { SupabaseParkingManager } from '@/utils/supabaseParkingManager';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [parkingManager] = useState(() => new SupabaseParkingManager());
  const [parkedCars, setParkedCars] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(50);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const forceRefresh = () => setRefresh(prev => prev + 1);

  const loadParkingData = async () => {
    try {
      setLoading(true);
      const [cars, available] = await Promise.all([
        parkingManager.getAllParkedCars(),
        parkingManager.getAvailableSlots()
      ]);
      setParkedCars(cars);
      setAvailableSlots(available);
    } catch (error) {
      console.error('Error loading parking data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load parking information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParkingData();
  }, [refresh]);

  const handleCarEntry = async (carData) => {
    try {
      setLoading(true);
      const result = await parkingManager.enterCar(carData.plateNumber, carData.ownerName);
      if (result.success) {
        toast({
          title: "Car Entered Successfully",
          description: `${carData.plateNumber} assigned to slot ${result.slotNumber}`,
        });
        forceRefresh();
      } else {
        toast({
          title: "Entry Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error entering car:', error);
      toast({
        title: "Entry Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCarExit = async (plateNumber) => {
    try {
      setLoading(true);
      const result = await parkingManager.exitCar(plateNumber);
      if (result.success) {
        setCurrentReceipt(result.receipt);
        toast({
          title: "Car Exited Successfully",
          description: `Total amount: ${result.receipt.totalAmount} RWF`,
        });
        forceRefresh();
      } else {
        toast({
          title: "Exit Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error exiting car:', error);
      toast({
        title: "Exit Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    const occupancyRate = ((50 - availableSlots) / 50) * 100;
    if (occupancyRate >= 90) return "bg-red-500";
    if (occupancyRate >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            SmartPark Rubavu
          </h1>
          <p className="text-lg text-gray-600">
            Automated Parking Management System - Database Powered
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  <p className="text-2xl font-bold">50</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{availableSlots}</p>
                </div>
                <div className={`h-3 w-3 rounded-full ${getStatusColor()}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-2xl font-bold text-red-600">{50 - availableSlots}</p>
                </div>
                <Car className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge variant={availableSlots === 0 ? "destructive" : "default"}>
                    {availableSlots === 0 ? "FULL" : "AVAILABLE"}
                  </Badge>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
              Processing...
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="slots">Parking Slots</TabsTrigger>
            <TabsTrigger value="cars">Parked Cars</TabsTrigger>
            <TabsTrigger value="receipt">Receipt</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    Car Entry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CarEntryForm 
                    onSubmit={handleCarEntry} 
                    disabled={availableSlots === 0 || loading}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Minus className="h-5 w-5 text-red-600" />
                    Car Exit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CarExitForm 
                    onSubmit={handleCarExit}
                    parkedCars={parkedCars}
                    disabled={loading}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="slots">
            <Card>
              <CardHeader>
                <CardTitle>Parking Slots Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <ParkingSlots parkingManager={parkingManager} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cars">
            <Card>
              <CardHeader>
                <CardTitle>Currently Parked Cars ({parkedCars.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {parkedCars.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No cars currently parked</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {parkedCars.map((car) => (
                      <Card key={car.plateNumber} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">{car.plateNumber}</span>
                              <Badge>Slot {car.slotNumber}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">Owner: {car.ownerName}</p>
                            <p className="text-sm text-gray-600">
                              Entry: {new Date(car.entryTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Duration: {Math.floor((Date.now() - new Date(car.entryTime).getTime()) / (1000 * 60 * 60))}h {Math.floor(((Date.now() - new Date(car.entryTime).getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipt">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Latest Receipt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReceiptDisplay receipt={currentReceipt} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Time & Space Complexity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComplexityAnalysis />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
