
const validFuelTypes = ['Gasolina', 'Diésel', 'Microhíbrido',
    'Híbrido', 'Eléctrico', 'GLP', 'GNL'];

const { ObjectId } = require('mongodb');

module.exports = function(app, vehiclesRepository, journeyRepository, usersRepository, refuelsRepository) {

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

        const numberPlateRegex = /^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$|^O[0-9]{4}[A-Z]{2}$/;
        if (!numberPlateRegex.test(vehicle.numberPlate)) {
            errors.numberPlate = 'Formato de matrícula inválido: La matrícula debe de seguir un formato válido Español';
        }

        if (vehicle.vin.length !== 17) {
            errors.vin = 'El número de bastidor debe contener exactamente 17 caracteres';
        }

        if (Object.keys(errors).length > 0 > 0) {
            res.render('vehicles/add.twig', {
                errors: errors,
                validFuelTypes: validFuelTypes
            });
            return;
        }

        try {
            errors.existingVehicle = {};

            const existingVehicleNP = await vehiclesRepository
                .findVehicleByNumberPlate(vehicle.numberPlate);
            if(existingVehicleNP) {
                errors.existingVehicle.numberPlate = 'Matrícula ya registrada en el sistema.'
            }

            const existingVehicleVIN = await vehiclesRepository
                .findVehicleByVin(vehicle.vin);
            if(existingVehicleVIN) {
                errors.existingVehicle.VIN = 'Número de bastidor ya registrado en el sistema.'
            }

            if (Object.keys(errors.existingVehicle).length > 0) {
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
            const user = await usersRepository.findUser({_id: new ObjectId(req.session.userId)},{});
            let result;
            let options = {sort: { numberPlate: 1}};
            let filter = {};
            if(user.role==="EMPLOYEE") {
                filter = { status: "LIBRE"};
            }
            result = await vehiclesRepository.getVehiclesPaginated(filter, options, page);
            let lastPage = Math.ceil(result.total / 5);
            if (result.total % 5 === 0 && result.total > 0) {
                lastPage = result.total / 5;
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
                currentPage: page,
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
            await refuelsRepository.deleteMany({ vehicleId: { $in: vehicleIds } });
            return res.redirect('/vehicles/list?message=Vehículos eliminados con éxito&messageType=alert-info');
        } catch (error) {
            console.log("Error in delete operation:", error);
            res.status(500).redirect('/vehicles/list?message=Error al eliminar los vehículos&messageType=alert-danger');
        }
    });

};