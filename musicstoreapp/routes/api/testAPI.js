
const initializeDatabase = require('../../config/initDatabase');
module.exports = function (app, client) {
    app.post("/api/test/reset", async (req, res) => {
        try {
            const db = client.db();
            await db.collection("users").deleteMany({});
            await db.collection("vehicles").deleteMany({});
            await db.collection("journeys").deleteMany({});
            await initializeDatabase();
            res.status(200).send("Database reset.");
        } catch (e) {
            res.status(500).send("Error reseteando la BD.");
        }
    });
}
