module.exports = function(app, journeysRepository, vehiclesRepository) {

    app.get('/journeys/add', async function(req, res) {
        try {
            const vehicles = await vehiclesRepository.getAllVehicles();

            res.render('journeys/add.twig', {
                vehicles: vehicles
            });
        } catch (error) {
            res.render('journeys/add.twig', {
                errors: { error: 'Error al cargar los vehículos: ' + error.message },
                vehicles: []
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
                const vehicles = await vehiclesRepository.getAllVehicles();
                errors.ongoingJourney = 'Error: ya tienes un trayecto en curso con otro vehículo';
                res.render('journeys/add.twig', {
                    errors: errors,
                    vehicles: vehicles
                });
                return;
            }

            const existingVehicle = await vehiclesRepository.findVehicleByNumberPlateOrVin(numberPlate);
            if (!existingVehicle) {
                const vehicles = await vehiclesRepository.getAllVehicles();
                errors.existingVehicle = 'Error: el vehículo no se encuentra en la base de datos';
                res.render('journeys/add.twig', {
                    errors: errors,
                    vehicles: vehicles
                });
                return;
            }

            const vehicleInUse = await journeysRepository.findOngoingJourneyByVehicle(existingVehicle._id);
            if (vehicleInUse) {
                const vehicles = await vehiclesRepository.getAllVehicles();
                errors.vehicleInUse = 'Error: el vehículo seleccionado ya está en uso por otro empleado';
                res.render('journeys/add.twig', {
                    errors: errors,
                    vehicles: vehicles
                });
                return;
            }

            let odometerStart = existingVehicle.mileage;
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

            await journeysRepository.insertJourney(journey)

            await vehiclesRepository.updateVehicle(
                { status: "OCUPADO", mileage: odometerStart },
                { _id: existingVehicle._id }
            );

            res.redirect('/journeys/vehicle/' + existingVehicle._id);
        } catch (error) {
            const vehicles = await vehiclesRepository.getAllVehicles();
            errors.error = 'Error al registrar el inicio del trayecto: ' + error.message;
            res.render('journeys/add.twig', {
                errors: errors,
                vehicles: vehicles
            });
        }
    });

    app.get('/journeys/list', async function(req, res) {
        try {
            const employeeId = req.session.user;
            let filter = {employeeId: employeeId};
            let page = parseInt(req.query.page) || 1; // Es String !!!
            journeysRepository.getJourneysByEmployeePaginated(filter, {}, page).then(result => {
                let lastPage = result.total / 4;
                if (result.total % 4 > 0) { // Sobran decimales
                    lastPage = lastPage + 1;
                }
                let pages = []; // paginas mostrar
                for (let i = page - 2; i <= page + 2; i++) {
                    if (i > 0 && i <= lastPage) {
                        pages.push(i);
                    }
                }
                res.render('journeys/list.twig', {
                    journeys: result.journeys,
                    pages: pages,
                    currentPage: page
                });
            })
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