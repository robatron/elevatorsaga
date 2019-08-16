const initElevator = (elevator, floors) => {
    const middleFloor = Math.round(floors.length / 2);

    // Elevator default state: Turn on BOTH indicators (so passengers enter),
    // then go to middle floor to wait
    const setElevatorDefaultState = () => {
        elevator.goToFloor(middleFloor);
        elevator.goingDownIndicator(true);
        elevator.goingUpIndicator(true);
    };

    // When a floor button is pressed, push floor onto destination queue
    elevator.on('floor_button_pressed', floorNum => {
        elevator.goToFloor(floorNum);
    });

    // When elevator is passing a floor...
    elevator.on('passing_floor', (floorNum, direction) => {
        // Passing floor
    });

    // When elevator is stopped at a floor...
    elevator.on('stopped_at_floor', floorNum => {
        // Maybe decide where to go next?
    });

    // When idle, send elevator to default state
    elevator.on('idle', () => {
        setElevatorDefaultState();
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

        console.log('Initializing elevators...');
        elevators.forEach(elevator => initElevator(elevator, elevators));

        console.log('Initializing floors...');
        floors.forEach(floor => initFloor(floor, elevators));
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    },
};
