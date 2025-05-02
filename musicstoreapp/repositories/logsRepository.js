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
    },getLogTypes: async function() {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const logsCollection = database.collection(this.collectionName);
            return await logsCollection.distinct("type");
        } catch (error) {
            console.error("Error al obtener tipos de logs:", error);
            throw error;
        }
    },
    getLogs: async function() {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const logsCollection = database.collection(this.collectionName);
            const cursor = logsCollection.find({});
            const logs = await cursor.toArray();
            return logs;
        } catch (error) {
            throw error;
        }
    },
    getLogsByType: async function(type) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const logsCollection = database.collection(this.collectionName);
            const cursor = logsCollection.find({ type: type });
            const logs = await cursor.toArray();
            return logs;
        } catch (error) {
            throw error;
        }
    },
    deleteLog: async function(logId) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const logsCollection = database.collection(this.collectionName);

            // Si el logId es un string, convertirlo a ObjectId
            let id = logId;
            if (typeof logId === 'string') {
                id = new ObjectId(logId);
            }

            const result = await logsCollection.deleteOne({ _id: id });
            return result.deletedCount === 1;
        } catch (error) {
            throw error;
        }
    }

};