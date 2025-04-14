
const validFuelTypes = ['Gasolina', 'Diésel', 'Microhíbrido',
    'Híbrido', 'Eléctrico', 'GLP', 'GNL'];

const { ObjectId } = require('mongodb');

module.exports = function(app, vehiclesRepository, journeyRepository) {

    app.get('/vehicles/add', function (req, res) {
        res.render("vehicles/add.twig", {
            validFuelTypes: validFuelTypes
        });
    })
    app.post('/vehicles/add', async function(req, res) {
        let vehicle = {
            numberPlate: req.body.numberPlate?.trim(),
            vin: req.body.vin?.trim(),
            brand: req.body.brand?.trim(),
            model: req.body.model?.trim(),
            fuelType: req.body.fuelType?.trim(),
            mileage: 0,
            status: "LIBRE"
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
            res.redirect('/vehicles/list');

        } catch (error) {
            errors.error = 'Error al guardar el vehículo: ' + error.message;
            res.render('vehicles/add.twig',
                {
                    errors: errors,
                    validFuelTypes: validFuelTypes
                });
        }
    });

    app.get('/vehicles/list', async function(req, res) {
        let page = parseInt(req.query.page) || 1;
        try {
            const result = await vehiclesRepository.getVehiclesPaginated(page);

            let lastPage = Math.ceil(result.total / 5);
            if (result.total % 4 > 0) {
                lastPage = lastPage + 1;
            }
            let pages = [];
            for (let i = page - 2; i <= page + 2; i++) {
                if (i > 0 && i <= lastPage) {
                    pages.push(i);
                }
            }
            res.render("vehicles/list.twig", {
                vehicles: result.vehicles,
                pages: pages,
                currentPage: page
            });
        } catch (error) {
            res.render("vehicles/list.twig", {
                errors: {error: "Se ha producido un error al listar los vehículos: " + error.message}
            });
        }
    });

    app.post('/vehicles/delete', async function(req, res) {
        try {
            let vehicleIds = req.body.selectedVehicles;
            vehicleIds = Array.isArray(vehicleIds) ? vehicleIds : [vehicleIds];

            vehicleIds = vehicleIds.map(id => new ObjectId(id));

            if (!vehicleIds || vehicleIds.length === 0) {
                return res.redirect('/vehicles/list?message=Seleccione al menos un vehículo');
            }

            await journeyRepository.deleteMany({ vehicleId: { $in: vehicleIds } });
            await vehiclesRepository.deleteMany({ _id: { $in: vehicleIds }});

            return res.redirect('/vehicles/list?message=Vehículos eliminados con éxito');
        } catch (error) {
            console.log("Error in delete operation:", error);
            res.status(500).redirect('/vehicles/list?message=Error al eliminar los vehículos');
        }
    });

};