const {ObjectId} = require("mongodb");
module.exports = function (app, favoriteSongsRepository, songsRepository) {
    app.get("/songs/favorites", async function (req, res) {
        try {
            let filter = {user: req.session.user};
            let response = await favoriteSongsRepository.getSongs(filter, {});
            let songs = response.songs;
            let price = 0;

             for (let i = 0; i < songs.length; i++) {
                 price += parseFloat(songs[i].price) || 0;
             }

            res.render("songs/favorites.twig", {songs: songs, price: price});
        } catch (error) {
            res.status(500).send("Error al buscar las canciones");
        }
    });

    app.post('/songs/favorites/add/:song_id', function (req, res) {
        let song_id = new ObjectId(req.params.song_id)
        let filter = {_id: song_id};
        songsRepository.findSong(filter, {}).then(song => {
            let favoriteSong = {
                song_id: song_id, title: song.title, date: new Date(), price: song.price, user: req.session.user
            }
            favoriteSongsRepository.insertSong(favoriteSong, function (result) {
                if (result.songId !== null && result.songId !== undefined) {
                    res.send("Agregada la canción ID: " + result.songId)
                } else {
                    res.send("Error al insertar canción con id " + result.error);
                }
            });
        }).catch(err => {
            res.send("Error al insertar canción " + err);
        });
    });


    app.get('/songs/favorites/delete/:song_id', function (req, res) {
        let song_id = new ObjectId(req.params.song_id);
        let filter = { song_id: song_id };
        favoriteSongsRepository.findSong(filter, {}).then(song => {
            favoriteSongsRepository.removeSong(filter, {}, function (result) {
                if (result.error) {
                    res.send("Error al borrar canción " + result.error);
                } else {
                    res.send({ message: 'Canción eliminada', songId: result.songId });
                }
            });
        }).catch(err => {
            res.send("Error al borrar canción " + err);
        });
    });


}



