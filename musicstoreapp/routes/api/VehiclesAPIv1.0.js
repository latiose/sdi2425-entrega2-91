const { ObjectId } = require('mongodb');

module.exports = function (app, vehiclesRepository) {
    app.get('/api/v1.0/vehicles/list', async (req, res) => {
        try {
            const vehicles = await vehiclesRepository.getAllVehicles();
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({error: 'No se pudo obtener la lista de vehículos.'});
        }
    });
}