const express = require('express')
const Notes = require('../models/noteSchema')

const SaveRoute = express.Router();

SaveRoute.post('/postnote', async (req,res)=>{
    try{
    const { heading, body} = req.body;
    const {username} = req.user;
    const newNote = new Notes({
        username,heading,body
    });
    const savedNote = await newNote.save();
    res.status(200).json({
        savedNote
    })
    }
    catch(error){
        res.status(501).json({
            error
        })
    }

})

module.exports = SaveRoute;