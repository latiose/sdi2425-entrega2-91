module.exports = function(app, journeysRepository, vehiclesRepository) {

    app.get('/journeys/add', async function (req, res) {
        try {
            const vehicles = await vehiclesRepository.getAllVehicles();
            res.render("journeys/add.twig", {
                vehicles: vehicles
            });
        } catch (error) {
            res.render("journeys/add.twig", {
                errors: { error: 'Error al cargar los vehículos disponibles: ' + error.message }
            });
        }
    });

    app.post('/journeys/add', async function(req, res) {
        let numberPlate = req.body.numberPlate;
        let errors = {};

        try {
            const employeeId = req.session.user;

            const ongoingJourney = await journeysRepository.findOngoingJourneyByEmployee(employeeId);
            if (ongoingJourney) {
                errors.ongoingJourney = 'Error: ya tienes un trayecto en curso con otro vehículo';
                res.render('journeys/add.twig', {
                    errors: errors
                });
                return;
            }

            const existingVehicle = await vehiclesRepository.findVehicleByNumberPlateOrVin(numberPlate);
            if (!existingVehicle) {
                errors.existingVehicle = 'Error: el vehículo no se encuentra en la base de datos';
                res.render('journeys/add.twig', {
                    errors: errors
                });
                return;
            }

            const vehicleInUse = await journeysRepository.findOngoingJourneyByVehicle(existingVehicle._id);
            if (vehicleInUse) {
                errors.vehicleInUse = 'Error: el vehículo seleccionado ya está en uso por otro empleado';
                res.render('journeys/add.twig', {
                    errors: errors
                });
                return;
            }

            let odometerStart = 0;
            const lastJourney = await journeysRepository.findLastJourneyByVehicle(existingVehicle._id);
            if (lastJourney && lastJourney.odometerEnd) {
                odometerStart = lastJourney.odometerEnd;
            }

            let journey = {
                startDate: new Date(),
                odometerStart: odometerStart,
                vehicleId: existingVehicle._id,
                vehiclePlate: numberPlate,
                employeeId: employeeId
            };

            await journeysRepository.insertJourney(journey);

            res.redirect('/journeys/vehicle/' + existingVehicle._id);
        } catch (error) {
            errors.error = 'Error al registrar el inicio del trayecto: ' + error.message;
            res.render('journeys/add.twig', {
                errors: errors
            });
        }
    });

    app.get('/journeys/list', async function(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5;
            const employeeId = req.session.user._id;

            const journeys = await journeysRepository.getJourneysByEmployeePaginated(employeeId, page, limit);
            const totalJourneys = await journeysRepository.countJourneysByEmployee(employeeId);
            const totalPages = Math.ceil(totalJourneys / limit);

            res.render('journeys/list.twig', {
                journeys: journeys,
                currentPage: page,
                totalPages: totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages
            });
        } catch (error) {
            res.render('journeys/list.twig', {
                errors: { error: 'Error al obtener los trayectos: ' + error.message }
            });
        }
    });

    app.get('/journeys/vehicle/:id', async function(req, res) {
        try {
            const vehicleId = req.params.id;
            const journeys = await journeysRepository.getJourneysByVehicle(vehicleId);

            res.render('journeys/vehicle.twig', {
                journeys: journeys
            });
        } catch (error) {
            res.render('journeys/vehicle.twig', {
                errors: { error: 'Error al obtener los trayectos del vehículo: ' + error.message }
            });
        }
    });
};