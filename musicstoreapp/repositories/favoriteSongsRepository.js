module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "favorite_songs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
        getSongs: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            const songs = await songsCollection.find(filter, options).toArray();
            return {songs};
        } catch (error) {
            throw (error);
        }
    },
    removeSong: async function (filter, options, callbackFunction) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            const result = await songsCollection.deleteOne(filter, options);
            callbackFunction({ songId: result.deletedCount > 0 ? filter._id : null });
            await this.dbClient.close();
        } catch (err) {
            callbackFunction({ error: err.message });
        }
    },
        insertSong: function (song, callbackFunction) {
        this.dbClient.connect()
            .then(() => {
                const database = this.dbClient.db(this.database);
                const songsCollection = database.collection(this.collectionName);
                songsCollection.insertOne(song)
                    .then(result => callbackFunction({songId: result.insertedId}))
                    .then(() => this.dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            })
            .catch(err => callbackFunction({error: err.message}))
    }

};