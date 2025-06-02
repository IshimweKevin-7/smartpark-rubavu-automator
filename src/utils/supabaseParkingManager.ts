
import { supabase } from "@/integrations/supabase/client";

export class SupabaseParkingManager {
  constructor() {
    console.log("Supabase Parking Manager initialized");
  }

  /**
   * Check if parking is full
   * Time Complexity: O(1) - single database query
   * Space Complexity: O(1) - constant space
   */
  async isFull() {
    console.log("Checking if parking is full - O(1) database operation");
    const { count, error } = await supabase
      .from('parked_cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (error) {
      console.error('Error checking if parking is full:', error);
      return false;
    }
    
    const currentCount = count || 0;
    console.log(`Current active cars: ${currentCount}/50`);
    return currentCount >= 50;
  }

  /**
   * Get available slots count
   * Time Complexity: O(1) - single database query with count
   * Space Complexity: O(1) - constant space
   */
  async getAvailableSlots() {
    console.log("Counting available slots - O(1) database operation");
    const { count, error } = await supabase
      .from('parked_cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (error) {
      console.error('Error counting available slots:', error);
      return 0;
    }
    
    const available = 50 - (count || 0);
    console.log(`Available slots: ${available}`);
    return available;
  }

  /**
   * Find first available slot
   * Time Complexity: O(n) - worst case, check all slots
   * Space Complexity: O(1) - constant space
   */
  async findAvailableSlot() {
    console.log("Finding available slot - O(n) database operation");
    
    try {
      // Get all occupied slot numbers
      const { data: occupiedSlots, error } = await supabase
        .from('parked_cars')
        .select('slot_number')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching occupied slots:', error);
        return -1;
      }

      const occupiedNumbers = new Set(occupiedSlots?.map(slot => slot.slot_number) || []);
      console.log(`Occupied slots: ${Array.from(occupiedNumbers).join(', ')}`);
      
      // Find first available slot from 1 to 50
      for (let i = 1; i <= 50; i++) {
        if (!occupiedNumbers.has(i)) {
          console.log(`Found available slot: ${i}`);
          return i;
        }
      }
      
      console.log("No available slots found");
      return -1; // No available slot
    } catch (error) {
      console.error('Error in findAvailableSlot:', error);
      return -1;
    }
  }

  /**
   * Enter a car into parking
   * Time Complexity: O(1) - database insert operation
   * Space Complexity: O(1) - constant additional space
   */
  async enterCar(plateNumber: string, ownerName: string) {
    console.log(`Entering car ${plateNumber} - O(1) database operation`);
    
    try {
      // First check if car already exists (this should be the first check)
      const { data: existingCar, error: checkError } = await supabase
        .from('parked_cars')
        .select('id, plate_number')
        .eq('plate_number', plateNumber.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing car:', checkError);
        return {
          success: false,
          message: "Database error while checking existing car"
        };
      }

      if (existingCar) {
        console.log(`Car ${plateNumber} already exists in parking`);
        return {
          success: false,
          message: "Car with this plate number is already parked"
        };
      }

      // Check available slots count
      const availableCount = await this.getAvailableSlots();
      if (availableCount <= 0) {
        console.log("Parking is full - no available slots");
        return {
          success: false,
          message: "Parking is full. No available slots."
        };
      }

      // Find available slot
      const slotNumber = await this.findAvailableSlot();
      if (slotNumber === -1) {
        console.log("No specific slot found");
        return {
          success: false,
          message: "No available slots found."
        };
      }

      // Insert car data
      const { data, error } = await supabase
        .from('parked_cars')
        .insert({
          plate_number: plateNumber.toUpperCase(),
          owner_name: ownerName,
          slot_number: slotNumber,
          entry_time: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting car data:', error);
        return {
          success: false,
          message: `Database error: ${error.message}`
        };
      }

      console.log(`Car ${plateNumber} successfully entered in slot ${slotNumber}`);

      // Update parking slot status
      const { error: updateError } = await supabase
        .from('parking_slots')
        .update({ 
          is_occupied: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('slot_number', slotNumber);

      if (updateError) {
        console.error('Error updating parking slot:', updateError);
        // Don't fail the entire operation for this
      }

      return {
        success: true,
        slotNumber,
        entryTime: data.entry_time,
        message: `Car ${plateNumber} assigned to slot ${slotNumber}`
      };
    } catch (error) {
      console.error('Error entering car:', error);
      return {
        success: false,
        message: `Failed to enter car: ${error.message}`
      };
    }
  }

  /**
   * Exit a car from parking
   * Time Complexity: O(1) - direct database access
   * Space Complexity: O(1) - constant space for receipt
   */
  async exitCar(plateNumber: string) {
    console.log(`Exiting car ${plateNumber} - O(1) database operation`);
    
    try {
      // Get car data
      const { data: carData, error: fetchError } = await supabase
        .from('parked_cars')
        .select('*')
        .eq('plate_number', plateNumber.toUpperCase())
        .eq('is_active', true)
        .single();

      if (fetchError || !carData) {
        return {
          success: false,
          message: "Car not found in parking"
        };
      }

      const exitTime = new Date().toISOString();
      const duration = new Date(exitTime).getTime() - new Date(carData.entry_time).getTime();
      
      // Calculate parking fee
      const receipt = this.calculateParkingFee(carData, exitTime, duration);

      // Update car record
      const { error: updateError } = await supabase
        .from('parked_cars')
        .update({
          exit_time: exitTime,
          total_amount: receipt.totalAmount,
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', carData.id);

      if (updateError) {
        throw updateError;
      }

      // Update parking slot status
      await supabase
        .from('parking_slots')
        .update({ is_occupied: false, updated_at: new Date().toISOString() })
        .eq('slot_number', carData.slot_number);

      return {
        success: true,
        receipt,
        message: `Car ${plateNumber} exited successfully`
      };
    } catch (error) {
      console.error('Error exiting car:', error);
      return {
        success: false,
        message: "Failed to exit car. Please try again."
      };
    }
  }

  /**
   * Calculate parking fee
   * Time Complexity: O(1) - simple arithmetic operations
   * Space Complexity: O(1) - constant space for receipt object
   */
  calculateParkingFee(carData: any, exitTime: string, duration: number) {
    console.log("Calculating parking fee - O(1) operation");
    
    const baseRate = 500; // RWF per hour
    const extraRate = 300; // RWF per extra hour

    const hours = duration / (1000 * 60 * 60); // Convert to hours
    const fullHours = Math.floor(hours);
    const extraMinutes = Math.ceil((hours - fullHours) * 60);
    
    let totalAmount = 0;
    
    if (fullHours >= 1) {
      totalAmount += baseRate; // First hour
      if (fullHours > 1) {
        totalAmount += (fullHours - 1) * extraRate; // Additional full hours
      }
    } else {
      totalAmount += baseRate; // Minimum 1 hour charge
    }
    
    // Add extra time charge if any minutes beyond full hours
    if (extraMinutes > 0 && fullHours >= 1) {
      totalAmount += extraRate;
    }

    return {
      plateNumber: carData.plate_number,
      ownerName: carData.owner_name,
      slotNumber: carData.slot_number,
      entryTime: carData.entry_time,
      exitTime,
      duration: {
        hours: fullHours,
        minutes: extraMinutes,
        totalHours: Math.ceil(hours)
      },
      charges: {
        baseHour: baseRate,
        extraHours: Math.max(0, Math.ceil(hours) - 1) * extraRate,
        totalAmount
      },
      totalAmount
    };
  }

  /**
   * Get all parked cars
   * Time Complexity: O(n) - database query for all active cars
   * Space Complexity: O(k) - where k is number of parked cars
   */
  async getAllParkedCars() {
    console.log("Getting all parked cars - O(n) database operation");
    
    const { data, error } = await supabase
      .from('parked_cars')
      .select('*')
      .eq('is_active', true)
      .order('entry_time', { ascending: true });

    if (error) {
      console.error('Error fetching parked cars:', error);
      return [];
    }

    return data?.map(car => ({
      plateNumber: car.plate_number,
      ownerName: car.owner_name,
      slotNumber: car.slot_number,
      entryTime: car.entry_time
    })) || [];
  }

  /**
   * Get parking statistics
   * Time Complexity: O(1) - single database query with count
   * Space Complexity: O(1) - constant space for stats
   */
  async getParkingStats() {
    console.log("Getting parking statistics - O(1) database operation");
    
    const { count } = await supabase
      .from('parked_cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    const occupiedSlots = count || 0;
    const occupancyRate = (occupiedSlots / 50) * 100;
    
    return {
      totalSlots: 50,
      occupiedSlots,
      availableSlots: 50 - occupiedSlots,
      occupancyRate: occupancyRate.toFixed(2),
      isFull: occupiedSlots >= 50
    };
  }

  /**
   * Find car by plate number
   * Time Complexity: O(1) - direct database query with index
   * Space Complexity: O(1) - constant space
   */
  async findCar(plateNumber: string) {
    console.log(`Finding car ${plateNumber} - O(1) database operation`);
    
    const { data, error } = await supabase
      .from('parked_cars')
      .select('*')
      .eq('plate_number', plateNumber.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      plateNumber: data.plate_number,
      ownerName: data.owner_name,
      slotNumber: data.slot_number,
      entryTime: data.entry_time
    };
  }

  /**
   * Get slot information
   * Time Complexity: O(1) - direct database query
   * Space Complexity: O(1) - constant space
   */
  async getSlotInfo(slotNumber: number) {
    console.log(`Getting slot ${slotNumber} info - O(1) database operation`);
    
    const { data, error } = await supabase
      .from('parked_cars')
      .select('*')
      .eq('slot_number', slotNumber)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      plateNumber: data.plate_number,
      ownerName: data.owner_name,
      slotNumber: data.slot_number,
      entryTime: data.entry_time
    };
  }
}
