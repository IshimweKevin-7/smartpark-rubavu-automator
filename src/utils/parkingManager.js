
/**
 * SmartPark Parking Management System
 * Data Structure: Array-based implementation for parking slots
 * Time Complexity Analysis included for each operation
 */

export class ParkingManager {
  constructor(maxSlots = 50) {
    this.maxSlots = maxSlots;
    this.slots = new Array(maxSlots).fill(null); // Space: O(n)
    this.carRegistry = new Map(); // Space: O(n) for storing car details
    this.entryTime = new Map(); // Space: O(n) for storing entry times
    
    // Pricing configuration
    this.baseRate = 500; // RWF per hour
    this.extraRate = 300; // RWF per extra hour after first hour
  }

  /**
   * Check if parking is full
   * Time Complexity: O(n) - worst case, we check all slots
   * Space Complexity: O(1) - constant space
   */
  isFull() {
    console.log("Checking if parking is full - O(n) operation");
    return !this.slots.includes(null);
  }

  /**
   * Get available slots count
   * Time Complexity: O(n) - need to count null slots
   * Space Complexity: O(1) - constant space
   */
  getAvailableSlots() {
    console.log("Counting available slots - O(n) operation");
    return this.slots.filter(slot => slot === null).length;
  }

  /**
   * Find first available slot
   * Time Complexity: O(n) - worst case, check all slots
   * Space Complexity: O(1) - constant space
   */
  findAvailableSlot() {
    console.log("Finding available slot - O(n) operation");
    for (let i = 0; i < this.maxSlots; i++) {
      if (this.slots[i] === null) {
        return i + 1; // Return 1-based slot number
      }
    }
    return -1; // No available slot
  }

  /**
   * Enter a car into parking
   * Time Complexity: O(n) - due to slot finding and duplicate checking
   * Space Complexity: O(1) - constant additional space
   */
  enterCar(plateNumber, ownerName) {
    console.log(`Entering car ${plateNumber} - O(n) operation`);
    
    // Check if car already exists - O(1) with Map
    if (this.carRegistry.has(plateNumber)) {
      return {
        success: false,
        message: "Car with this plate number is already parked"
      };
    }

    // Check if parking is full - O(n)
    if (this.isFull()) {
      return {
        success: false,
        message: "Parking is full. No available slots."
      };
    }

    // Find available slot - O(n)
    const slotNumber = this.findAvailableSlot();
    const slotIndex = slotNumber - 1;

    // Store car information - O(1)
    const carData = {
      plateNumber,
      ownerName,
      slotNumber,
      entryTime: Date.now()
    };

    this.slots[slotIndex] = carData;
    this.carRegistry.set(plateNumber, carData);
    this.entryTime.set(plateNumber, Date.now());

    return {
      success: true,
      slotNumber,
      entryTime: carData.entryTime,
      message: `Car ${plateNumber} assigned to slot ${slotNumber}`
    };
  }

  /**
   * Exit a car from parking
   * Time Complexity: O(1) - direct access using Map
   * Space Complexity: O(1) - constant space for receipt
   */
  exitCar(plateNumber) {
    console.log(`Exiting car ${plateNumber} - O(1) operation`);
    
    // Check if car exists - O(1)
    if (!this.carRegistry.has(plateNumber)) {
      return {
        success: false,
        message: "Car not found in parking"
      };
    }

    const carData = this.carRegistry.get(plateNumber);
    const exitTime = Date.now();
    const duration = exitTime - carData.entryTime;
    
    // Calculate parking fee
    const receipt = this.calculateParkingFee(carData, exitTime, duration);

    // Remove car from parking - O(1)
    this.slots[carData.slotNumber - 1] = null;
    this.carRegistry.delete(plateNumber);
    this.entryTime.delete(plateNumber);

    return {
      success: true,
      receipt,
      message: `Car ${plateNumber} exited successfully`
    };
  }

  /**
   * Calculate parking fee
   * Time Complexity: O(1) - simple arithmetic operations
   * Space Complexity: O(1) - constant space for receipt object
   */
  calculateParkingFee(carData, exitTime, duration) {
    console.log("Calculating parking fee - O(1) operation");
    
    const hours = duration / (1000 * 60 * 60); // Convert to hours
    const fullHours = Math.floor(hours);
    const extraMinutes = Math.ceil((hours - fullHours) * 60);
    
    let totalAmount = 0;
    
    if (fullHours >= 1) {
      totalAmount += this.baseRate; // First hour
      if (fullHours > 1) {
        totalAmount += (fullHours - 1) * this.extraRate; // Additional full hours
      }
    } else {
      totalAmount += this.baseRate; // Minimum 1 hour charge
    }
    
    // Add extra time charge if any minutes beyond full hours
    if (extraMinutes > 0 && fullHours >= 1) {
      totalAmount += this.extraRate;
    }

    return {
      plateNumber: carData.plateNumber,
      ownerName: carData.ownerName,
      slotNumber: carData.slotNumber,
      entryTime: carData.entryTime,
      exitTime,
      duration: {
        hours: fullHours,
        minutes: extraMinutes,
        totalHours: Math.ceil(hours)
      },
      charges: {
        baseHour: this.baseRate,
        extraHours: Math.max(0, Math.ceil(hours) - 1) * this.extraRate,
        totalAmount
      },
      totalAmount
    };
  }

  /**
   * Traverse all parked cars
   * Time Complexity: O(n) - need to check all slots
   * Space Complexity: O(k) - where k is number of parked cars
   */
  getAllParkedCars() {
    console.log("Traversing all parked cars - O(n) operation");
    return this.slots.filter(slot => slot !== null);
  }

  /**
   * Get parking statistics
   * Time Complexity: O(n) - need to traverse all slots
   * Space Complexity: O(1) - constant space for stats
   */
  getParkingStats() {
    console.log("Getting parking statistics - O(n) operation");
    const parkedCars = this.getAllParkedCars();
    const occupancyRate = (parkedCars.length / this.maxSlots) * 100;
    
    return {
      totalSlots: this.maxSlots,
      occupiedSlots: parkedCars.length,
      availableSlots: this.maxSlots - parkedCars.length,
      occupancyRate: occupancyRate.toFixed(2),
      isFull: this.isFull()
    };
  }

  /**
   * Find car by plate number
   * Time Complexity: O(1) - direct Map access
   * Space Complexity: O(1) - constant space
   */
  findCar(plateNumber) {
    console.log(`Finding car ${plateNumber} - O(1) operation`);
    return this.carRegistry.get(plateNumber) || null;
  }

  /**
   * Get slot information
   * Time Complexity: O(1) - direct array access
   * Space Complexity: O(1) - constant space
   */
  getSlotInfo(slotNumber) {
    console.log(`Getting slot ${slotNumber} info - O(1) operation`);
    const slotIndex = slotNumber - 1;
    if (slotIndex < 0 || slotIndex >= this.maxSlots) {
      return null;
    }
    return this.slots[slotIndex];
  }
}
