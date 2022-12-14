/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/allplaylistpairs', PlaylistController.getAllPlaylistPairs)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlists/query', PlaylistController.getPlaylistsByQuery)
router.put('/playlist/:id', PlaylistController.updatePlaylist)

module.exports = router