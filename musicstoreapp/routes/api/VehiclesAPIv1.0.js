const { ObjectId } = require('mongodb');

module.exports = function (app, vehiclesRepository, usersRepository) {
    app.get('/api/v1.0/vehicles/list', async (req, res) => {
        try {
            const vehicles = await vehiclesRepository.getAllVehicles();
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({error: 'No se pudo obtener la lista de vehículos.'});
        }
    });

    app.get('/api/v1.0/vehicles/available', async (req, res) => {
        try {
            let token = req.headers['token'];
            if (!token) {
                return res.status(401).json({
                    error: 'Debes estar identificado para ver la lista de vehículos disponibles'
                });
            }
            let decodedToken = app.get('jwt').verify(token, "secreto");
            const userDni = decodedToken.user;
            const employee = await usersRepository.findUser({ dni: userDni });
            if (!employee) {
                return res.status(500).json({ error: 'No se pudo recuperar el usuario actual.' });
            }
            const vehicles = await vehiclesRepository.getFilteredVehicles({status: "LIBRE"});
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({error: 'No se pudo obtener la lista de vehículos disponibles.'});
        }
    })
}