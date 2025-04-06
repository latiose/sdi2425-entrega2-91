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
    }
};