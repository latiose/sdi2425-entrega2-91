
const validFuelTypes = ['Gasolina', 'Diesel', 'Microhíbrido',
    'Híbrido', 'Eléctrico', 'GLP', 'GNL'];

module.exports = function(app, vehiclesRepository) {

    app.get('/vehicles/add', function (req, res) {
        res.render("vehicles/add.twig");
    })
    app.post('/vehicles/add', async function(req, res) {
        let vehicle = {
            numberPlate: req.body.numberPlate?.trim(),
            vin: req.body.vin?.trim(),
            brand: req.body.brand?.trim(),
            model: req.body.model?.trim(),
            fuelType: req.body.fuelType?.trim()
        };
        let errors = {};

        if (!vehicle.numberPlate || !vehicle.vin || !vehicle.brand ||
            !vehicle.model || !vehicle.fuelType) {
            errors.empty = "Los campos no pueden estar vacíos";
        }

        if (req.body.numberPlate !== vehicle.numberPlate ||
            req.body.vin !== vehicle.vin ||
            req.body.brand !== vehicle.brand ||
            req.body.model !== vehicle.model ||
            req.body.fuelType !== vehicle.fuelType) {
            errors.spaces = "Los campos no deben contener espacios al principio o al final";
        }

        const licensePlateRegex = /^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$|^[O][0-9]{4}[A-Z]{2}$/;
        if (!licensePlateRegex.test(vehicle.numberPlate)) {
            errors.numberPlate = 'Formato de matrícula inválido';
        }

        if (vehicle.vin.length !== 17) {
            errors.vin = 'El número de bastidor debe tener 17 caracteres';
        }

        if (errors.length > 0) {
            res.render('vehicles/add.twig', {
                errors: errors,
                validFuelTypes: validFuelTypes
            });
            return;
        }

        try {
            const existingVehicle = await vehiclesRepository
                .findVehicleByNumberPlateOrVin(vehicle.numberPlate, vehicle.vin);

            if (existingVehicle) {
                errors.existingVehicle = 'Matrícula o número de bastidor ya existe'
                res.render('vehicles/add.twig',
                    {
                        errors: errors,
                        validFuelTypes: validFuelTypes
                    });
                return;
            }

            await vehiclesRepository.insertVehicle(vehicle);
            // res.redirect('/vehicles'); cuando esté hecho el ejercicio
            res.send("Vehículo '" + vehicle.vin + "' registrado correctamente");

        } catch (error) {
            errors.error = 'Error al guardar el vehículo: ' + error.message;
            res.render('vehicles/add.twig',
                {
                    errors: errors,
                    validFuelTypes: validFuelTypes
                });
        }
    });

};