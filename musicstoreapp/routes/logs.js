module.exports = function(app, logsRepository) {
    app.get('/logs/list', async (req, res) => {
        res.send("lista de logs");
    });

    app.post('/logs/delete', async (req, res) => {

    });
};