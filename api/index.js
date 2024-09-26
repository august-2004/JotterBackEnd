const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const MongoStore = require('connect-mongo');
require('dotenv').config();

const RegisterRoute = require('../routes/RegisterRoute');
const LoginRoute = require('../routes/LoginRoute');
const SaveRoute = require('../routes/SaveRoute')

const User = require('../models/userSchema')

const app = express();
const PORT = 3001;
app.use(cors());
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


app.get('/', (request,response)=>
    {
        response.send(200,"The server works");
    });

app.use(RegisterRoute);
app.use(LoginRoute);
app.use(SaveRoute);




app.listen(PORT, ()=>{
    console.log("Running in port 3001");
});



