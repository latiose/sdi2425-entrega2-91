module.exports = {
    dbClient: null,
    app: null,
    database: "gestorapp",
    collectionName: "logs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    insertLog: async function (log) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const logsCollection = database.collection(this.collectionName);
            return await logsCollection.insertOne(log);
        } catch (error) {
            throw error;
        }
    }
};