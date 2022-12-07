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
        likes : {type : Number, default : 0, required : false},
        dislikes : {type : Number, default : 0, required : false},
        listens : {type : Number, default : 0, required : false},
        comments : {type : [{
            owner : String,
            comment : String
        }], required : true},
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        publishedAt :{type: Date, required: false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
