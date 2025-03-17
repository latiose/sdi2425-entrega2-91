module.exports = function(app) {
    app.get("/authors", function(req, res) {
        let authors = [{
            "name": "Pablo",
            "group": "fito y los fitipaldis",
            "role": "Cantante"
        }, {
            "name": "Pepe",
            "group": "siniestro total",
            "role": "Trompetista"
        }, {
            "name": "Juan",
            "group": "estopa",
            "role": "Saxofonista"
        }];
        let response = {
            authors: authors
        };
        res.render("authors/authors.twig", response);
    });
    app.get('/authors/add', function (req, res) {
        let roles = ["Cantante","Trompetista","Violinista","Saxofonista","Guitarrista" ];
        res.render("authors/add.twig", { roles: roles });
    });
    app.post('/authors/add', function(req, res) {
        let response = "";
        if(req.body.name != null && typeof(req.body.name) != "undefined") {
            response += "Cantante: " +req.body.name;
        } else {
            response += " Nombre no enviado en la peticion "
        }
        if(req.body.group != null && typeof(req.body.group) != "undefined") {
            response += " grupo: " +req.body.group;
        } else {
            response += "Grupo no enviado en la peticion"
        }
        if(req.body.role != null && typeof(req.body.role) != "undefined") {
            response += " role: " +req.body.role;
        } else {
            response += "Rol no enviado en la peticion"
        }

        res.send(response);
    });
    app.get('/authors/filter/:role', function (req, res) {
            let authors = [{
                "name": "Pablo",
                "group": "fito y los fitipaldis",
                "role": "Cantante"
            }, {
                "name": "Pepe",
                "group": "siniestro total",
                "role": "Trompetista"
            }, {
                "name": "Juan",
                "group": "estopa",
                "role": "Saxofonista"
            }].filter(author => author.role.toLowerCase().includes(req.params.role.toLowerCase()));
        res.render("authors/authors.twig/", { authors: authors });
    });
    app.get('/authors/*', function (req, res) {
        res.redirect("/authors")
    });


};



