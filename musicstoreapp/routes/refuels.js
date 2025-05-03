const {ObjectId} = require("mongodb");
module.exports = function(app, refuelsRepository, journeysRepository, vehiclesRepository) {
    app.get('/refuels/add', async (req, res) => {
        res.render('refuels/add');
    })
    app.post('/refuels/add', async (req, res) => {
        let refuel = {
            stationName: req.body.stationName.trim(),
            amount: req.body.amount?.trim(),
            price: req.body.price?.trim(),
            fullTank: req.body.fullTank === 'true',
            odometer: req.body.odometer,
            comments: req.body.comments?.trim(),
            date: new Date()
        };

        let errors = {};

        if (!refuel.stationName || !refuel.amount || !refuel.price || !refuel.odometer) {
            // No verifico fullTank porque es un booleano
            errors.empty = "Ningún campo salvo el de observaciones puede estar vacío";
        }

        if (req.body.stationName !== refuel.stationName ||
            req.body.amount !== refuel.amount ||
            req.body.price !== refuel.price ||
            req.body.odometer !== refuel.odometer) {
            errors.spaces = "Los campos no deben contener espacios al principio o al final";
        }

        if (refuel.amount <= 0) {
            errors.amount = 'Formato de cantidad inválido: La cantidad debe de ser un número positivo';
        }
        if (refuel.price <= 0) {
            errors.price = 'Formato de precio inválido: El precio debe de ser un número positivo';
        }

        if (Object.keys(errors).length > 0) {
            res.render('refuels/add.twig', {
                errors: errors
            });
            return;
        }

        try {
            let journey = await journeysRepository.findOngoingJourneyByEmployee(req.session.userId);
            if (!journey) {
                errors.journey = 'No tienes ningún trayecto en curso';
            }
            else if(journey.odometerStart >= refuel.odometer) {
                errors.odometer = 'El valor del odómetro debe ser superior al del inicio del trayecto';
            }

            if (Object.keys(errors).length > 0) {
                res.render('refuels/add.twig', {
                    errors: errors
                });
                return;
            }
            refuel.journeyId = journey._id;
            refuel.vehicleId = journey.vehicleId;
            await refuelsRepository.insertRefuel(refuel);
            res.redirect(`/refuels/vehicle/${refuel.vehicleId}`);
        } catch (error) {
            console.error(error);
            res.render('refuels/add.twig', {
                error: 'Error al añadir el repostaje'
            });
        }
    });

    app.get('/refuels/vehicle/:id', async(req, res) => {
        try{
            let vehicles = await vehiclesRepository.getAllVehicles();
            if (vehicles.length === 0) {
                return res.render('refuels/vehicle.twig', {
                    errors: { error: 'No hay vehículos disponibles.' }
                });
            }

            let vehicleId = req.params.id;
            if (!ObjectId.isValid(vehicleId) || !vehicles.some(v => v._id.toString() === vehicleId)) {
                vehicleId = vehicles[0]._id.toString();
            }

            let filter = { vehicleId: new ObjectId(vehicleId) };
            let page = parseInt(req.query.page) || 1;
            let options = {sort: { date: -1}};
            const result = await refuelsRepository.getRefuelsPaginated(filter, options, page);
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
            let error;
            if(result.refuels.length === 0){
                error = 'No hay repostajes para este vehículo';
            }
            let fuelTypeVehicle = await vehiclesRepository.getVehicleById(vehicleId);
            console.log(fuelTypeVehicle);
            result.refuels.forEach(refuel => { refuel.fuelType = fuelTypeVehicle.fuelType });
            res.render('refuels/vehicle.twig', {
                refuels: result.refuels,
                pages,
                currentPage: page,
                currentVehicleId: vehicleId,
                vehicles: vehicles,
                error: error
            })
        } catch (error) {
            console.log(error)
            res.render('refuels/vehicle.twig', {
                error: 'Error al obtener los repostajes'
            })
        }

    })
}