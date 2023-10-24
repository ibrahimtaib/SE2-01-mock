'use strict';

const express = require('express');
const morgan = require('morgan');
const dao = require('./dao');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { check, body, validationResult } = require('express-validator'); 
const session = require('express-session');
const cors = require('cors');

///* API Login *///

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
      return next();
  
    return res.status(401).json({ error: 'Not authenticated' });
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        dao.getUser(username, hash).then((user) => {
            if (!user)
                return done(null, false, { message: 'Username o password errata!' });
            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user.userID);
});

passport.deserializeUser((id, done) => {
    dao.getUserById(id)
        .then(user => {
            done(null, user);
        }).catch(err => {
            done(err, null);
        });
});

const app = new express();
const port = 3001;


app.use(session({
    secret: 'iej3d213ode31dncjd',
    resave: false,
    saveUninitialized: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/sessions',
  body("username", "Username non può essere vuoto").isString().notEmpty(),
  body("password", "Password non può essere vuoto").isString().notEmpty(),
  passport.authenticate('local'), (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors[0].msg });
    }


    res.json(req.user);
  });


app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

///*  API Website  *///