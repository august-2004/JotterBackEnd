const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const MongoStore = require('connect-mongo');
require('dotenv').config();
const Notes = require('../models/noteSchema')


const RegisterRoute = require('../routes/RegisterRoute');
const LoginRoute = require('../routes/LoginRoute');
const SaveRoute = require('../routes/SaveRoute')

const User = require('../models/userSchema')

const app = express();
const PORT = 3001;

const allowedOrigins = ["https://jotterapp.vercel.app"];

app.use(cors({
  origin: "https://jotterapp.vercel.app",
  credentials: true 
}));

app.use(express.json());

mongoose.connect(process.env.MONGOACCESSS)
    .then(()=>console.log("Connected sucessfuly to the database"))
    .catch((err)=>console.log(err));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGOACCESSS , 
        collectionName: 'sessions',
        }),
    cookie: {
            secure: false, 
            maxAge: 1000*60*60*24,
            path: '/',
            httpOnly: true
        }
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy.Strategy(
    async (username, password, done) => {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});






app.listen(3000);


app.post('/getnote', async (request,response)=>
    {   if(request.isAuthenticated()){
        console.log("User " + request.user.username +" authentication: "+ request.isAuthenticated())
        const username = request.user.username
        const allNotes = await Notes.find({username});
        response.status(200).json({
            username,
            noteArray : allNotes,
    });}
    else{
        response.status(401).json({
            isLoggedIn : false
        })
        }
    });

app.use(RegisterRoute);
app.use(LoginRoute);
app.use(SaveRoute);

// app.use(express.static(path.join(__dirname, 'dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });



app.listen(PORT, ()=>{
    console.log("Running in port 3001");
});



