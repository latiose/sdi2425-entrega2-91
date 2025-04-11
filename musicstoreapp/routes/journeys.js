const { ObjectId } = require('mongodb');

module.exports = function(app, journeysRepository, vehiclesRepository) {

    app.get('/journeys/add', async function(req, res) {
        try {
            const vehicles = await vehiclesRepository.getAllVehicles();
            res.render('journeys/add.twig', { vehicles });
        } catch (error) {
            res.render('journeys/add.twig', {
                errors: { error: 'Error al cargar los vehículos: ' + error.message },
                vehicles: []
            });
        }
    });

    app.get('/journeys/end/:id', async function(req, res) {
        try {
            const journeyId = req.params.id;

            if (!journeyId) {
                return res.render('journeys/end.twig', {
                    errors: { error: 'ID de trayecto no proporcionado' }
                });
            }

            const journey = await journeysRepository.findJourney({ _id: new ObjectId(journeyId) }, {});

            if (!journey) {
                return res.render('journeys/end.twig', {
                    errors: { error: 'El trayecto no existe' }
                });
            }

            if (journey.endDate) {
                return res.render('journeys/end.twig', {
                    errors: { error: 'Este trayecto ya ha sido finalizado' }
                });
            }

            if (journey.employeeId !== req.session.user) {
                return res.render('journeys/end.twig', {
                    errors: { error: 'No tienes permiso para finalizar este trayecto' }
                });
            }

            res.render('journeys/end.twig', { journey });
        } catch (error) {
            res.render('journeys/end.twig', {
                errors: { error: 'Error al cargar el trayecto: ' + error.message }
            });
        }
    });

    app.post('/journeys/end', async function(req, res) {
        let errors = {};
        try {
            let id = req.body._id;
            let comments = req.body.comments || '';
            let odometer = parseInt(req.body.odometerEnd);
            let employeeId = req.session.user;

            let filter = {
                _id: new ObjectId(id),
                endDate: { $exists: false },
                employeeId: employeeId
            };

            const journey = await journeysRepository.findJourney(filter, {});
            if (!journey) {
                errors.invalidJourney = 'O bien no existe el trayecto para este usuario o ya está acabado';
                return res.render('journeys/end.twig', {
                    errors: errors,
                    journey: { _id: id }
                });
            }

            if (!odometer || odometer < 0 || odometer < journey.odometerStart) {
                errors.odometer = 'Error: valor final del odómetro inválido';
                return res.render('journeys/end.twig', {
                    errors: errors,
                    journey
                });
            }

            await vehiclesRepository.updateVehicle(
                { _id: journey.vehicleId },
                { $set: { status: "LIBRE", mileage: odometer } }
            );


            await journeysRepository.completeJourney(new ObjectId(id), odometer, comments);

            res.redirect('/journeys/vehicle/' + journey.vehicleId);
        } catch (error) {
            res.render('journeys/end.twig', {
                errors: { error: 'Error al finalizar el trayecto: ' + error.message },
                journey: { _id: req.body._id }
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
                return res.render('journeys/add.twig', { errors, vehicles });
            }

            const existingVehicle = await vehiclesRepository.findVehicleByNumberPlateOrVin(numberPlate);
            if (!existingVehicle) {
                const vehicles = await vehiclesRepository.getAllVehicles();
                errors.existingVehicle = 'Error: el vehículo no se encuentra en la base de datos';
                return res.render('journeys/add.twig', { errors, vehicles });
            }

            const vehicleInUse = await journeysRepository.findOngoingJourneyByVehicle(new ObjectId(existingVehicle._id));
            if (vehicleInUse) {
                const vehicles = await vehiclesRepository.getAllVehicles();
                errors.vehicleInUse = 'Error: el vehículo seleccionado ya está en uso por otro empleado';
                return res.render('journeys/add.twig', { errors, vehicles });
            }

            let odometerStart = existingVehicle.mileage;
            const lastJourney = await journeysRepository.findLastJourneyByVehicle(new ObjectId(existingVehicle._id));
            if (lastJourney && lastJourney.odometerEnd) {
                odometerStart = lastJourney.odometerEnd;
            }

            let journey = {
                startDate: new Date(),
                odometerStart: odometerStart,
                vehicleId: new ObjectId(existingVehicle._id),
                vehiclePlate: numberPlate,
                employeeId: employeeId
            };

            await journeysRepository.insertJourney(journey);

            await vehiclesRepository.updateVehicle(
                { _id: existingVehicle._id },
                { $set: { status: "OCUPADO", mileage: odometerStart } }
            );


            res.redirect('/journeys/vehicle/' + existingVehicle._id);
        } catch (error) {
            const vehicles = await vehiclesRepository.getAllVehicles();
            errors.error = 'Error al registrar el inicio del trayecto: ' + error.message;
            res.render('journeys/add.twig', { errors, vehicles });
        }
    });

    app.get('/journeys/list', async function(req, res) {
        try {
            const employeeId = req.session.user;
            let filter = { employeeId };
            let page = parseInt(req.query.page) || 1;
            journeysRepository.getJourneysByEmployeePaginated(filter, {}, page).then(result => {
                let lastPage = result.total / 4;
                if (result.total % 4 > 0) lastPage += 1;

                let pages = [];
                for (let i = page - 2; i <= page + 2; i++) {
                    if (i > 0 && i <= lastPage) {
                        pages.push(i);
                    }
                }

                res.render('journeys/list.twig', {
                    journeys: result.journeys,
                    pages,
                    currentPage: page
                });
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
            const journeys = await journeysRepository.getJourneysByVehicle(new ObjectId(vehicleId));

            res.render('journeys/vehicle.twig', { journeys });
        } catch (error) {
            res.render('journeys/vehicle.twig', {
                errors: { error: 'Error al obtener los trayectos del vehículo: ' + error.message }
            });
        }
    });
};
