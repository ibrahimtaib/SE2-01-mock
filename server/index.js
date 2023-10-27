"use strict";

const express = require("express");
const morgan = require("morgan");
const dao = require("./dao");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const { application } = require("express");
///* API Login *///

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated" });
};

passport.use(
  new LocalStrategy(function (username, password, done) {
    dao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: "Username o password errata!" });
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

app.post(
  "/api/sessions",
  body("username", "Username non può essere vuoto").isString().notEmpty(),
  body("password", "Password non può essere vuoto").isString().notEmpty(),
  passport.authenticate("local"),
  (req, res) => {
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
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

/* Create Ticket */

app.post("/api/tickets", (req, res) => {
  const { serviceId } = req.body;

  if (serviceId == undefined) {
    res.status(400).json({ error: "ServiceId is required!" });
    return;
  }

  dao
    .createTicket(req.body.serviceType)
    .then((ticket) => {
      res.json(ticket);
    })
    .catch((err) => {
      res.status(500).json({ error: "An error occurred during your request" });
    });
});

//Create a service
app.post("/api/service", (req, res) => {
  if (!req.body.service) {
    return res.status(400).json({ error: "Service name is required!" });
  }
  dao
    .createService(req.body.service)
    .then((result) => res.json(result))
    .catch((err) =>
      res
        .status(500)
        .json({ error: "An error occurred while creating the service." })
    );
});

//add a service to a counter
app.post("/api/config_counters", async (req, res) => {
  const { counterID, serviceID } = req.body;
  try {
    const result = await dao.addServiceToCounter(counterID, serviceID);
    console.log(result);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});
//add a lot of services to a lot of counters
app.post("/api/counters/services", async (req, res) => {
  const { counters, services } = req.body;
  if (counters == undefined || services == undefined)
    return res
      .status(400)
      .json({ error: "counters and services should be in the request's body" });
  if (!Array.isArray(counters) || !Array.isArray(services))
    return res
      .status(400)
      .json({ error: "counters and services should be arrays" });
  try {
    const result = await dao.addServiceToCounter_bis(counters, services);
    if (result.error) res.status(500).json(result.error);
    else res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred during the request" });
  }
});

app.delete("/api/counters/services", async (req, res) => {
  const { counters, services } = req.body;
  if (counters == undefined || services == undefined)
    return res
      .status(400)
      .json({ error: "counters and services should be in the request's body" });
  if (!Array.isArray(counters) || !Array.isArray(services))
    return res
      .status(400)
      .json({ error: "counters and services should be arrays" });
  try {
    const result = await dao.deleteServiceFromCounter_bis(counters, services);
    if (result.error) res.status(500).json(result.error);
    else res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred during the request" });
  }
});
//Get All Services
app.get("/api/services", async (req, res) => {
  try {
    const result = await dao.getServices();
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

//Get All Counters
app.get("/api/counters", async (req, res) => {
  try {
    const result = await dao.getCounters();
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/next/:counterId", async (req, res) => {
  try {
    const counterId = req.params.counterId;
    const result = await dao.getNextCustomer(counterId);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*delete all services of a counter
app.delete('/api/delete_services/:counterID', async (req, res) => {
  try {
      const result = await dao.deleteServices(counterID);
      res.json(result);
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

app.delete("/api/delete_service", async (req, res) => {
  try {
    console.log(req.body.serviceID);
    await dao.deleteService(req.body.serviceID);
    res.json({});
  } catch (err) {
    res.status(500).json({ error: `Internal Server Error` });
  }
});

///*  API Website  *///
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports=app;
