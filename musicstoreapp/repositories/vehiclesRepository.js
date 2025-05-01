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
    findVehicleByNumberPlate: async function(numberPlate) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.findOne({
                numberPlate: numberPlate
            });
        } catch (error) {
            throw error;
        }
    },
    findVehicleByVin: async function(vin) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.findOne({
                vin: vin
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
    getVehiclesNotUsedPaginated: async function(page) {
        try {
            const limit = 5;
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            const filter = { status: "LIBRE" };
            const totalVehicles = await vehiclesCollection.countDocuments(filter);
            const cursor = vehiclesCollection.find(filter)
                .skip((page - 1) * limit)
                .limit(limit);
            const vehicles = await cursor.toArray();

            return { vehicles: vehicles, total: totalVehicles };
        } catch (error) {
            throw error;
        }
    },
    updateVehicle: async function(filter, update, options = {}) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehicleCollection = database.collection(this.collectionName);
            const result = await vehicleCollection.updateOne(filter, update, options);
            return result;
        } catch (error) {
            throw error;
        }
    },
    deleteMany: async function(filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.deleteMany(filter);
        } catch(error) {
            throw error;
        }
    },

    getFilteredVehicles: async function(filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            return await vehiclesCollection.find(filter).toArray();
        } catch (error) {
            throw error;
        }
    },getVehicleById: async function(id) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const vehiclesCollection = database.collection(this.collectionName);
            const { ObjectId } = require("mongodb");
            return await vehiclesCollection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw error;
        }
    }

};