const mongoose = require('mongoose');

const noteData = new mongoose.Schema({
    heading : String,
    para : String
})


module.exports  = mongoose.model('noteData',noteData)