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
    }
};