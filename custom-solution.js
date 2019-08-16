const initElevator = (elevator, floors) => {
    console.log('Initializing elevator');
    const middleFloor = Math.round(floors.length / 2);

    // Elevator default state: Turn on BOTH indicators, go to middle floor
    const setElevatorDefaultState = () => {
        elevator.goToFloor(middleFloor);
        elevator.goingDownIndicator(true);
        elevator.goingUpIndicator(true);
    };

    // When idle, send elevator to default state
    elevator.on('idle', () => {
        setElevatorDefaultState();
    });

    elevator.on('floor_button_pressed', floorNum => {
        // Queue floor destination
        elevator.goToFloor(floorNum);
    });

    elevator.on('passing_floor', (floorNum, direction) => {
        // Passing floor
    });

    elevator.on('stopped_at_floor', floorNum => {
        // Maybe decide where to go next?
    });

    setElevatorDefaultState();
};

const getLeastBusyElevator = elevators => {
    let smallestDestinationQueue = Infinity;
    let leastBusyElevator = null;

    elevators.forEach(elevator => {
        if (elevator.destinationQueue.length < smallestDestinationQueue) {
            leastBusyElevator = elevator;
            smallestDestinationQueue = elevator.destinationQueue.length;
        }
    });

    return leastBusyElevator;
};

const initFloor = (floor, elevators) => {
    console.log('Initializing floor #', floor.floorNum());

    floor.on('down_button_pressed', () => {
        const leastBusyElevator = getLeastBusyElevator(elevators);

        console.log('>>>', 'floor DOWN button pressed', floor.floorNum());
        console.log('>>>', 'Least busy elevator', leastBusyElevator); // DEBUGGGG

        leastBusyElevator.goToFloor(floor.floorNum());
    });

    floor.on('up_button_pressed', () => {
        const leastBusyElevator = getLeastBusyElevator(elevators);

        console.log('>>>', 'floor UP button pressed', floor.floorNum());
        console.log('>>>', 'Least busy elevator', leastBusyElevator); // DEBUGGGG

        leastBusyElevator.goToFloor(floor.floorNum());
    });
};

window.CUSTOM_SOLUTION = {
    init: (elevators, floors) => {
        console.log('USING EXTERNAL JS FILE');
        elevators.forEach(elevator => initElevator(elevator, elevators));
        floors.forEach(floor => {
            initFloor(floor, elevators);
        });
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    },
};
