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
  const reqs = problemRequirements[problemTitle] || { classes: [], methods: [], interfaces: [] };

  const classNames = reqs.classes.filter((c) => submission.includes(c));
  const methods = reqs.methods.filter((m) => submission.includes(m));
  const interfaces = reqs.interfaces.filter((i) => submission.includes(i));

  const total = reqs.classes.length + reqs.methods.length + reqs.interfaces.length;
  const passed = classNames.length + methods.length + interfaces.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

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
