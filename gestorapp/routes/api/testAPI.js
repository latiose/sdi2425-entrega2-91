
const initializeDatabase = require('../../config/initDatabase');

module.exports = function (app, client) {
    app.post("/api/test/reset", async (req, res) => {
        try {
            await initializeDatabase(client);
            res.status(200).send("Database reset.");
        } catch (e) {
            console.error("Error resetting database:", e);
            res.status(500).send("Error resetting the database.");
        }
    });
};