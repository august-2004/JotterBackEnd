/* eslint-disable no-multiple-empty-lines */
/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const noteData = require('./noteSchema');
const cors = require('cors');



const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/allmynotes').then(()=>
        console.log("Connected sucessfuly to the database")).catch((err)=>console.log(err));

app.get('/', (request,response)=>
{
     response.send(200,"The server works");
});

app.post('/postnote', async (req,res) => {
    console.log(req.body);
    const {heading , para} = req.body;
    const newNote = await noteData.create(req.body);
    await    newNote.save();
    res.send("file Stored")
    
})

app.post('/getnote', async (req,res) => {
    console.log(req.body);
    const all = await noteData.find();
    res.send(all);
    console.log( "sent data", all)
})

app.listen(PORT, ()=>{
    console.log("Running in port 3001");
});



