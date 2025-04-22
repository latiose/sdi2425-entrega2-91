const { ObjectId } = require('mongodb');

module.exports = function(app, journeysRepository, vehiclesRepository,usersRepository) {

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
                return res.redirect('/journeys/list');
            }

            const journey = await journeysRepository.findJourney({ _id: new ObjectId(journeyId) }, {});

            if (!journey) {
                return res.redirect('/journeys/list');
            }

            if (journey.endDate) {
                return res.redirect('/journeys/list');
            }

            if (journey.employeeId.toString() !== req.session.userId) {
                return res.redirect('/journeys/list');
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
            const employeeId = req.session.userId;

            let filter = {
                _id: new ObjectId(id),
                endDate: { $exists: false },
                employeeId: new ObjectId(employeeId)
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
            const employeeId = req.session.userId;

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

            let employee = await usersRepository.findUser({ _id: new ObjectId(employeeId) });

            if (!employee) {
                const vehicles = await vehiclesRepository.getAllVehicles();
                errors.employee = 'Error: no se ha podido recuperar el usuario actual';
                return res.render('journeys/add.twig', { errors, vehicles });
            }

            let journey = {
                startDate: new Date(),
                odometerStart: odometerStart,
                vehicleId: new ObjectId(existingVehicle._id),
                vehiclePlate: numberPlate,
                employeeId: new ObjectId(employeeId),
                driverName: employee.dni
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
            const employeeId = req.session.userId;
            let filter = { employeeId: new ObjectId(employeeId) };
            let page = parseInt(req.query.page) || 1;
            journeysRepository.getJourneysPaginated(filter, {}, page).then(result => {
                let lastPage = Math.ceil(result.total / 5);
                if (result.total % 5 === 0 && result.total > 0) {
                    lastPage = result.total / 5;
                }
                let pages = [];
                for (let i = page - 1; i <= page + 1; i++) {
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
                const vehicles = await vehiclesRepository.getAllVehicles();
                if (vehicles.length === 0) {
                    return res.render('journeys/vehicle.twig', {
                        errors: { error: 'No hay vehículos disponibles.' }
                    });
                }

                let vehicleId = req.params.id;
                if (!ObjectId.isValid(vehicleId)) {
                    vehicleId = vehicles[0]._id.toString();
                } else {
                    const exists = vehicles.some(v => v._id.toString() === vehicleId);
                    if (!exists) {
                        vehicleId = vehicles[0]._id.toString();
                    }
                }

                let filter = { vehicleId: new ObjectId(vehicleId) };
                let page = parseInt(req.query.page) || 1;

                const result = await journeysRepository.getJourneysPaginated(filter, {}, page);
            let lastPage = Math.ceil(result.total / 5);
            if (result.total % 5 === 0 && result.total > 0) {
                lastPage = result.total / 5;
            }

            let pages = [];
            for (let i = page - 1; i <= page + 1; i++) {
                if (i > 0 && i <= lastPage) {
                    pages.push(i);
                }
            }

                res.render('journeys/vehicle.twig', {
                    vehicles: vehicles,
                    journeys: result.journeys,
                    pages,
                    currentPage: page,
                    currentVehicleId: vehicleId
                });

        } catch (error) {
            res.render('journeys/vehicle.twig', {
                errors: { error: 'Error al obtener los trayectos del vehículo: ' + error.message }
            });
        }
    });
};
