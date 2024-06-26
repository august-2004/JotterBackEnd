/* eslint-disable no-multiple-empty-lines */
/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const noteData = require('./noteSchema');
const cors = require('cors');



const app = express();
const PORT = 3001;
app.use(cors({
    origin: "https://jotterapp.vercel.app",
    
},{
    origin: "https://localhost:5173",
    
}));
app.use(express.json())

mongoose.connect(process.env.MONGOACCESSS).then(()=>
        console.log("Connected sucessfuly to the database")).catch((err)=>console.log(err));

        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            
            next();
          });
app.get('/', (request,response)=>
{
     response.send(200,"The server works");
});

app.post('/postnote', async (req,res) => {
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    const {heading , para} = req.body;
    const newNote = await noteData.create(req.body);
    await    newNote.save();
    res.send("file Stored")
    
})

app.get('/getnote', async (req,res) => {
    console.log(req.body);
    const all = await noteData.find();
    res.send(all);
    console.log( "sent data", all)
})

app.listen(PORT, ()=>{
    console.log("Running in port 3001");
});



