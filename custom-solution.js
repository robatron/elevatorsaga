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

    // When elevator is stopped at a floor, sort the destination queue
    elevator.on('stopped_at_floor', floorNum => {
        // Sort queue, remove duplicates, and remove current floor
        elevator.destinationQueue = _.uniq(
            sortDestinationsByClosest(elevator.destinationQueue, floorNum),
        ).filter(destination => destination !== floorNum);

        // update destination queue in memory
        elevator.checkDestinationQueue();

        console.log(
            '>>> stopped at floor:',
            floorNum,
            'dest queue:',
            elevator.destinationQueue,
        );
    });

    // When idle, send elevator to default state
    elevator.on('idle', () => {
        setElevatorDefaultState();
    });

    setElevatorDefaultState();
};

// Find the elevator that has the fewest number of destiations queued
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

// Sort the destination queue by the closest -> furthest
const sortDestinationsByClosest = (destinationQueue, currentLocation) => {
    const newDestinationQueue = [];
    const distancesToFloors = {};

    // Fill a map of distances to floors that are that distance away from the
    // current location
    destinationQueue.forEach(destination => {
        const distanceToFloor = Math.abs(currentLocation - destination);
        distancesToFloors[distanceToFloor] =
            distancesToFloors[distanceToFloor] || [];
        distancesToFloors[distanceToFloor].push(destination);
    });

    // Sort the distances shortest -> furthest
    const sortedDistances = Object.keys(distancesToFloors).sort(
        (a, b) => a - b,
    );

    // Rebuild the destination queue and return
    sortedDistances.forEach(distance => {
        newDestinationQueue.push(distancesToFloors[distance]);
    });

    return newDestinationQueue.flat();
};

const initFloor = (floor, elevators) => {
    // When the DOWN button is pressed, tell the least-busy elevator to go to
    // that floor
    floor.on('down_button_pressed', () => {
        const leastBusyElevator = getLeastBusyElevator(elevators);
        leastBusyElevator.goToFloor(floor.floorNum());
    });

    // When the UP button is pressed, tell the least-busy elevator to go to that
    // floor when it can
    floor.on('up_button_pressed', () => {
        const leastBusyElevator = getLeastBusyElevator(elevators);
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
