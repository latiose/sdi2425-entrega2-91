const {ObjectId} = require("mongodb");
module.exports = function (app, journeysRepository, usersRepository, vehiclesRepository) {

    app.post('/api/v1.0/journeys/add', async function(req, res) {
        let numberPlate = req.body.numberPlate;

        if (!numberPlate) {
            return res.status(400).json({ error: 'La matrícula del vehículo es obligatoria.' });
        }

        try {
            let token = req.headers['token'];
            let decodedToken = app.get('jwt').verify(token, "secreto");
            const userDni = decodedToken.user;

            const employee = await usersRepository.findUser({ dni: userDni });
            if (!employee) {
                return res.status(500).json({ error: 'No se pudo recuperar el usuario actual.' });
            }

            const employeeId = employee._id;

            const ongoingJourney = await journeysRepository.findOngoingJourneyByEmployee(employeeId);
            if (ongoingJourney) {
                return res.status(400).json({ error: 'Ya tienes un trayecto en curso.' });
            }

            const existingVehicle = await vehiclesRepository.findVehicleByNumberPlateOrVin(numberPlate);
            if (!existingVehicle) {
                return res.status(404).json({ error: 'El vehículo no se encuentra en la base de datos.' });
            }

            const vehicleInUse = await journeysRepository.findOngoingJourneyByVehicle(new ObjectId(existingVehicle._id));
            if (vehicleInUse) {
                return res.status(400).json({ error: 'El vehículo está en uso por otro empleado.' });
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
                employeeId: new ObjectId(employeeId),
                driverName: userDni
            };

            const insertResult = await journeysRepository.insertJourney(journey);

            await vehiclesRepository.updateVehicle(
                { _id: existingVehicle._id },
                { $set: { status: "OCUPADO", mileage: odometerStart } }
            );

            res.status(201).json({
                message: 'Trayecto iniciado correctamente.',
                journeyId: insertResult.insertedId,
                vehicleId: existingVehicle._id
            });

        } catch (error) {
            console.error("Error al iniciar trayecto:", error);
            res.status(500).json({ error: 'Error al iniciar trayecto: ' + error.message });
        }
    });


    app.get('/api/v1.0/journeys/vehicle/:id', async function(req, res) {
        try {
            const vehicles = await vehiclesRepository.getAllVehicles();
            if (vehicles.length === 0) {
                return res.status(404).json({ error: 'No hay vehículos disponibles.' });
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

            const journeys = await journeysRepository.getJourneysByVehicle(new ObjectId(vehicleId));
            const vehicle = await vehiclesRepository.getVehicleById(vehicleId);
            res.json({
                vehicles,
                journeys,
                currentVehicleId: vehicleId,
                status:vehicle.status,
            });

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: 'Error al obtener los trayectos del vehículo: ' + error.message });
        }
    });

    app.get('/api/v1.0/journeys/user', async function(req, res) {
        try {
            let token = req.headers['token'];
            if (!token) {
                return res.status(401).json({
                    error: 'Debes estar identificado para ver  tu lista de trayectos'
                });
            }
            let decodedToken = app.get('jwt').verify(token, "secreto");

            const user = await usersRepository.findUser({dni: decodedToken.user});
            if (!user) {
                return res.status(500).json({ error: 'No se pudo recuperar el usuario actual.' });
            }

            const journeys = await journeysRepository.getAllJourneys({employeeId:
                new ObjectId(user._id)});
            journeys.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            res.json(journeys);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los trayectos: ' + error.message });
        }
    });
}