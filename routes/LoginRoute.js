const express = require('express');
const passport = require('passport')
const Notes = require('../models/noteSchema')

const LoginRoute = express.Router();

LoginRoute.post('/login',passport.authenticate('local'),async(req,res)=>{
    if(req.user){
        const username= req.user.username;
        const allNotes = await Notes.find({username})
        res.status(200).json({
            username,
            isLoggedIn:true,
            allNotes

        })
    }
    else{
        res.status(401).json({
            error: "Error in logging in"
        })
    }
    
});


// LoginRoute.post('/success',async (req,res)=>{
    
//     const username = req.user.username;
//     res.status(200).json({
//         isLoggedIn: true,
//         username
//     });
    
// });

// LoginRoute.get('/failure', (req, res) => {
//         res.status(401).json({
//             error: "Try again"
//         });
//     });


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