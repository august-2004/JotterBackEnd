const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10;
const passport = require('passport')


const RegisterRoute = express.Router();

RegisterRoute.post('/register',async (req,res,next)=>{
    try{

        
        const {username,password} = req.body;
        console.log(username)
        const exists =await  User.findOne({username});
        if(exists){
            return res.status(400).json({
                message : "Username already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();
        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server error' });
      }
},passport.authenticate('local'), (req,res)=>{
    if(req.user){
        const username= req.user.username;
        res.status(200).json({
            username,
            isLoggedIn:true,
            noteArray:[]
        })
    }
    else{
        res.status(401).json({
            error: "Error in logging in"
        })
    }
})


      



module.exports=RegisterRoute;
