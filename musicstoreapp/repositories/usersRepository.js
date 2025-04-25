module.exports = {
    mongoClient: null,
    app: null,
    database: "gestorapp",
    collectionName: "users",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    findUser: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const usersCollection = database.collection(this.collectionName);
            const user = await usersCollection.findOne(filter, options);
            return user;
        } catch (error) {
            throw (error);
        }
    },insertUser: async function (user) {
        try {
            if (!user.role || !['ADMIN', 'EMPLOYEE'].includes(user.role)) {
                user.role = 'EMPLOYEE';
            }
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const usersCollection = database.collection(this.collectionName);
            const result = await usersCollection.insertOne(user);
            return result.insertedId;
        } catch (error) {
            throw (error);
        }
    },
    getUsersPaginated: async function(page) {
        try {
            const limit = 5;
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const usersCollection = database.collection(this.collectionName);
            const totalUsers = await usersCollection.countDocuments();
            const cursor = usersCollection.find({})
                .skip((page - 1) * limit)
                .limit(limit);
            const users = await cursor.toArray();
            return { users: users, total: totalUsers };
        } catch (error) {
            throw error;
        }
    },
    updateUser: async function (id, updatedUser) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const usersCollection = database.collection(this.collectionName);

            const {ObjectId} = require('mongodb');
            const userId = typeof id === 'string' ? new ObjectId(id) : id;

            const result = await usersCollection.updateOne(
                {_id: userId},
                {user: updatedUser}
            );

            return result;
        } catch (error) {
            throw (error);
        }
    },
    findUserByDniExcludingId: async function (dni, excludeUserId) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const usersCollection = database.collection(this.collectionName);


            const filter = {
                dni: dni,
                _id: { $ne: excludeUserId }
            };

            const user = await usersCollection.findOne(filter);
            return user;
        } catch (error) {
            throw (error);
        }
    }
};
