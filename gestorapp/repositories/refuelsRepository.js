module.exports = {
    mongoClient: null,
    app: null,
    database: "gestorapp",
    collectionName: "refuels",

    init: function(app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    insertRefuel: async function(vehicle) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const refuelsCollection = database.collection(this.collectionName);
            return await refuelsCollection.insertOne(vehicle);
        } catch (error) {
            throw error;
        }
    },
    getFilteredRefuels: async function(filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const refuelsCollection = database.collection(this.collectionName);
            return await refuelsCollection.find(filter).toArray();
        } catch (error) {
            throw error;
        }
    },
    getRefuelsPaginated: async function(filter, options, page) {
        try {
            const limit = 5;
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const refuelsCollection = database.collection(this.collectionName);
            const refuelsCollectionCount = await refuelsCollection.countDocuments(filter);
            const cursor = refuelsCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const refuels = await cursor.toArray();
            const result = {refuels: refuels, total: refuelsCollectionCount};
            return result;
        } catch (error) {
            throw (error);
        }
    },
    deleteMany: async function(filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const refuelsCollection = database.collection(this.collectionName);
            return await refuelsCollection.deleteMany(filter);
        } catch(error) {
            throw error;
        }
    },
};