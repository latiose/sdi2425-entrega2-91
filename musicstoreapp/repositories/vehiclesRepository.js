module.exports = {
    mongoClient: null,
    app: null,
    database: "gestorapp",
    collectionName: "vehicles",

    init: function(app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },

    findVehicleByNumberPlateOrVin: async function(numberPlate, vin) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.findOne({
                $or: [
                    { numberPlate: numberPlate },
                    { vin: vin }
                ]
            });
        } catch (error) {
            throw error;
        }
    },

    insertVehicle: async function(vehicle) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.insertOne(vehicle);
        } catch (error) {
            throw error;
        }
    },

    getAllVehicles: async function() {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.find({}).toArray();
        } catch (error) {
            throw error;
        }
    },

    getVehiclesPaginated: async function(page) {
        try {
            const limit = 5;
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            const totalVehicles = await vehiclesCollection.countDocuments();
            const cursor = vehiclesCollection.find({})
                .skip((page - 1) * limit)
                .limit(limit);
            const vehicles = await cursor.toArray();
            return { vehicles: vehicles, total: totalVehicles };
        } catch (error) {
            throw error;
        }
    },
    updateVehicle: async function(vehicle, filter, options = {}) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehicleCollection = database.collection(this.collectionName);
            const result = await vehicleCollection.updateOne(filter, {$set: vehicle}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
};