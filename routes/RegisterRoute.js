const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10;

const RegisterRoute = express.Router();

RegisterRoute.post('/register',async (req,res)=>{
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
        console.log(newUser)
        await newUser.save();
        res.status(201).json({ message: 'User registered, Please Login In', showLogin: true });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
      }
})


      



module.exports=RegisterRoute;
