const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    username: String,
    heading : String,
    body : String
})


module.exports  = mongoose.model('Notes',noteSchema)