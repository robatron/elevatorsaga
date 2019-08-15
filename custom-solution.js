window.CUSTOM_SOLUTION = {
    init: (elevators, floors) => {
        // Set up elevators
        elevators.forEach(elevator => {
            const middleFloor = Math.round(elevators.length / 2);

            // Elevator default state: Turn off indicators, go to middle floor
            const setElevatorDefaultState = () => {
                elevator.goToFloor(middleFloor);
                elevator.goingDownIndicator(false);
                elevator.goingUpIndicator(false);
            };

            // When idle, send elevator to default state
            elevator.on('idle', function() {
                setElevatorDefaultState();
            });

            setElevatorDefaultState();
        });

        // Set up floors
        floors.forEach(floor => {});
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    },
};
