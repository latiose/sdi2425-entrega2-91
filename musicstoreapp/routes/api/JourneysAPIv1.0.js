const {ObjectId} = require("mongodb");
module.exports = function (app, journeysRepository,usersRepository,vehiclesRepository) {

    app.post('/api/v1.0/journeys/add', async function(req, res) {
        let numberPlate = req.body.numberPlate;

        if (!numberPlate) {
            return res.status(400).json({ error: 'La matrícula del vehículo es obligatoria.' });
        }

        try {
            const employeeId = req.session.userId;

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

            const employee = await usersRepository.findUser({ _id: new ObjectId(employeeId) });
            if (!employee) {
                return res.status(500).json({ error: 'No se pudo recuperar el usuario actual.' });
            }

            let journey = {
                startDate: new Date(),
                odometerStart: odometerStart,
                vehicleId: new ObjectId(existingVehicle._id),
                vehiclePlate: numberPlate,
                employeeId: new ObjectId(employeeId),
                driverName: employee.dni
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

            const filter = { vehicleId: new ObjectId(vehicleId) };
            const page = parseInt(req.query.page) || 1;

            const result = await journeysRepository.getJourneysPaginated(filter, {}, page);

            const total = result.total || 0;
            let lastPage = Math.ceil(total / 5);
            if (total % 5 === 0 && total > 0) {
                lastPage = total / 5;
            }

            const pages = [];
            for (let i = page - 1; i <= page + 1; i++) {
                if (i > 0 && i <= lastPage) {
                    pages.push(i);
                }
            }

            res.json({
                vehicles,
                journeys: result.journeys,
                pages,
                currentPage: page,
                currentVehicleId: vehicleId
            });

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los trayectos del vehículo: ' + error.message });
        }
    });




}


