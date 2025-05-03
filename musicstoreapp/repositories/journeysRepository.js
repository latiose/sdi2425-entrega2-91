const { ObjectId } = require('mongodb');
module.exports = {
    mongoClient: null,
    app: null,
    database: "gestorapp",
    collectionName: "journeys",

    init: function(app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },

    insertJourney: async function(journey) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.insertOne(journey);
        } catch (error) {
            throw error;
        }
    },


    findJourney: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.findOne(filter, options);
        } catch (error) {
            throw (error);
        }
    },

    getAllJourneys: async function(filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.find(filter || {}).toArray();
        } catch (error) {
            throw error;
        }
    },

    findOngoingJourneyByEmployee: async function(employeeId) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            const empId = typeof employeeId === 'string' ? new ObjectId(employeeId) : employeeId;
            return await journeysCollection.findOne({
                employeeId: empId,
                endDate: { $exists: false }
            });
        } catch (error) {
            throw error;
        }
    },
    findOngoingJourneyByVehicle: async function(vehicleId) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.findOne({
                vehicleId: vehicleId,
                endDate: { $exists: false }
            });
        } catch (error) {
            throw error;
        }
    },

    findLastJourneyByVehicle: async function(vehicleId) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.findOne(
                { vehicleId: vehicleId },
                { sort: { startDate: -1 } }
            );
        } catch (error) {
            throw error;
        }
    },

    getJourneysPaginated: async function(filter, options, page) {
        try {
            const limit = 5;
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            const journeysCollectionCount = await journeysCollection.countDocuments(filter);
            const cursor = journeysCollection.find(filter, options).skip((page - 1) * limit).limit(limit)
            const journeys = await cursor.toArray();
            return {journeys: journeys, total: journeysCollectionCount};
        } catch (error) {
            throw (error);
        }
    },


    getJourneysByVehicle: async function(vehicleId) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.find({ vehicleId: vehicleId })
                .sort({ startDate: -1 })
                .toArray();
        } catch (error) {
            throw error;
        }
    },

    completeJourney: async function(journeyId, odometerEnd,comments) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);

            const journey = await journeysCollection.findOne({ _id: journeyId });
            const endDate = new Date();
            const duration = (endDate - journey.startDate) / (1000 * 60);

            return await journeysCollection.updateOne(
                { _id: journeyId },
                {
                    $set: {
                        endDate: endDate,
                        odometerEnd: odometerEnd,
                        duration: duration,
                        comments: comments
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    },
    deleteMany: async function(filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const journeysCollection = database.collection(this.collectionName);
            return await journeysCollection.deleteMany(filter);
        } catch(error) {
            throw error;
        }
    },
};