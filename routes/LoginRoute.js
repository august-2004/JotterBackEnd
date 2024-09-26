const express = require('express');
const passport = require('passport')
const Notes = require('../models/noteSchema')

const LoginRoute = express.Router();

LoginRoute.post('/login', (req,res,next)=>{
        next();
    },passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure',
    }));


LoginRoute.post('/success',async (req,res)=>{
    try{
    const username = req.user.username
    const allNotes = await Notes.find({username})
    res.status(200).json({
        isLoggedIn: true,
        username,
        noteArray : allNotes
    });}
    catch(error){
        res.status(400).json({
            error
        })
    }
});

LoginRoute.post('/failure', (req, res) => {
        res.status(401).json({
            error: "Try again"
        });
    });

LoginRoute.post('/logout',(req,res)=>{
    req.logout((error) => {
        if (error) {
            return res.status(500).json({
                error
            });
        }
    });
    res.status(200).json({
        isLoggedIn : false
    })
})
module.exports = LoginRoute;