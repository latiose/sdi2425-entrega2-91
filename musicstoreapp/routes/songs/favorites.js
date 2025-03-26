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



        app.get('/songs/favorites/delete/:song_id', async function (req, res) {
            try {

                const song_id = new ObjectId(req.params.song_id);

                const existingFavorite = await favoriteSongsRepository.findSong(
                    { _id: song_id },
                    {}
                );

                if (!existingFavorite) {
                    return res.status(404).json({
                        message: 'Favorite song not found'
                    });
                }

                // Remove the song from favorites
                const result = await favoriteSongsRepository.removeSong(
                    { _id: song_id },
                    {}
                );

                if (result.success) {
                    res.json({
                        message: 'Song removed from favorites',
                        songId: song_id
                    });
                } else {
                    res.status(500).json({
                        message: 'Failed to remove song from favorites'
                    });
                }
            } catch (error) {
                console.error('Error deleting favorite song:', error);
                res.status(500).json({
                    message: 'Internal server error',
                    error: error.message
                });
            }
        });



}



