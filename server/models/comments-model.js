const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const commentsSchema = new Schema(
    {
        ownerEmail: { type: String, required: true },
        comment : {type : String, required : true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Comment',commentsSchema)
