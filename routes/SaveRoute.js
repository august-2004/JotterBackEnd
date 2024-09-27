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
    await newNote.save();
    const allNotes = await Notes.find({username})
    res.status(200).json({
        good: "yes",
        noteArray: allNotes
    })
    }
    catch(error){
        res.status(501).json({
            error
        })
    }

})

module.exports = SaveRoute;