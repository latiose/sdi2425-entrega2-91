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
            let decodedToken;
            try {
                decodedToken = app.get('jwt').verify(token, "secreto");
            } catch (error) {
                return res.status(401).json({
                    error: 'Para mostrar el listado de vehículos, el empleado tiene que estar identificado, por lo tanto, la petición debe contener un token de seguridad válido'
                });
            }
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