module.exports = function(app, refuelsRepository, journeysRepository) {
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
            await refuelsRepository.insertRefuel(refuel);
            res.send('Repostaje añadido: ' + refuel.stationName);
            // res.redirect('/refuels/list');
        } catch (error) {
            console.error(error);
            res.render('refuels/add.twig', {
                error: 'Error al añadir el repostaje'
            });
        }

    });
}