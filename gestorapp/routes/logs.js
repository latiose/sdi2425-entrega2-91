module.exports = function(app, logsRepository) {
    app.get('/logs/list', async function(req, res) {
        const type = req.query.type;

        try {
            const logTypes = await logsRepository.getLogTypes();

            let logsList;
            if (type && type !== "all") {
                logsList = await logsRepository.getLogsByType(type);
            } else {
                logsList = await logsRepository.getLogs();
            }

            res.render("logs/list.twig", {
                logTypes: logTypes,
                selectedType: type || "all",
                logs: logsList
            });
        } catch (error) {
            console.error("Error al listar logs:", error);
            res.status(500).send("Error al obtener los logs: " + error.message);
        }
    });


    app.post('/logs/delete', async function(req, res) {
        try {

            const type = req.body.type;

            if (!type) {
                return res.status(400).send("Tipo de log no especificado");
            }

            const logsToDelete = await logsRepository.getLogsByType(type);

            if (logsToDelete.length > 0) {


                for (const log of logsToDelete) {
                    await logsRepository.deleteLog(log._id);
                }

                res.redirect("/logs/list?message=Logs eliminados correctamente&messageType=alert-success");
            } else {
                res.redirect("/logs/list?message=No se encontraron logs para eliminar&messageType=alert-info");
            }
        } catch (error) {
            console.error("Error al eliminar logs:", error);
            res.status(500).send("Error al eliminar los logs: " + error.message);
        }
    });
};