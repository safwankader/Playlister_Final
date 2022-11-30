const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        ownerName : {type : String, required : false},
        published : {type : Boolean, default : false,  required : false}, 
        likes : {type : [{
            userEmail : String
        }] , required : false},
        dislikes : {type : [{
            userEmail : String
        }], required : false},
        listens : {type : Number, default : 0, required : false},
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
