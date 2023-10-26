"use strict";

const express = require("express");
const morgan = require("morgan");
const dao = require("./dao");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
///* API Login *///

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated" });
};

passport.use(
  new LocalStrategy(function (username, password, done) {
    dao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: "user or psw wrong" });
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.userID);
});

passport.deserializeUser((id, done) => {
  dao
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const app = new express();
const port = 3001;

app.use(
  session({
    secret: "iej3d213ode31dncjd",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));


app.post('/api/sessions',
  body("username", "Username non può essere vuoto").isString().notEmpty(),
  body("password", "Password non può essere vuoto").isString().notEmpty(),
  passport.authenticate('local'), (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors[0].msg });
    }

    res.json(req.user);
  }
);

app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


app.get('/api/nextcustomer/:counterId', async (req, res) => {
  const counterId = req.params.counterId;
  
  try {

    const customer = await dao.getNextCustomer(counterId);
    console.log("customer:", customer);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ error: 'Nessun cliente disponibile.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la richiesta del prossimo cliente.' });
  }

});

app.listen(port,
  () => { console.log(`Server started on http://localhost:${port}/`) }
);
///*  API Website  *///
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
