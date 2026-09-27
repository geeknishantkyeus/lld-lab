interface DeterministicResult {
  checks: {
    compilation: boolean;
    classNames: string[];
    methods: string[];
    interfaces: string[];
  };
  score: number;
}

const problemRequirements: Record<string, { classes: string[]; methods: string[]; interfaces: string[] }> = {
  'Parking Lot': {
    classes: ['ParkingLot', 'Vehicle', 'ParkingSpot', 'Ticket', 'Payment'],
    methods: ['park', 'unpark', 'calculateFee'],
    interfaces: ['Vehicle', 'Payment'],
  },
  'Elevator System': {
    classes: ['ElevatorController', 'ElevatorCar', 'Button', 'Display', 'Request'],
    methods: ['move', 'requestElevator', 'openDoor', 'closeDoor'],
    interfaces: ['Button'],
  },
  'Vending Machine': {
    classes: ['VendingMachine', 'Product', 'Inventory', 'State'],
    methods: ['insertCoin', 'selectProduct', 'dispense', 'refund'],
    interfaces: ['State'],
  },
};

export function evaluateDeterministic(submission: string, problemTitle: string): DeterministicResult {
  const requirements = problemRequirements[problemTitle] || { classes: [], methods: [], interfaces: [] };

  const classNames = requirements.classes.filter((cls) => submission.includes(cls));
  const methods = requirements.methods.filter((method) => submission.includes(method));
  const interfaces = requirements.interfaces.filter((iface) => submission.includes(iface));

  const totalChecks = requirements.classes.length + requirements.methods.length + requirements.interfaces.length;
  const passedChecks = classNames.length + methods.length + interfaces.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  return {
    checks: {
      compilation: submission.trim().length > 0,
      classNames,
      methods,
      interfaces,
    },
    score,
  };
}
