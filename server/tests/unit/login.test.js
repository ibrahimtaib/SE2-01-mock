const express = require('express');
const supertest = require('supertest');
const app = require('../../index'); // Import your Express app (index.js)

// Import the DAO module
const dao = require('../../dao');

const passport = require('passport');

// Use a mock Passport strategy for testing
jest.mock('passport');

// Define a mock for the passport-local strategy
const LocalStrategy = require('passport-local').Strategy;

const testingStrategy = new LocalStrategy((username, password, done) => {
  // Implement your testing strategy here, e.g., return a mock user
  if (username === 'testuser' && password === 'testpassword') {
    const user = { userID: 1, username: 'testuser' };
    done(null, user);
  } else {
    done(null, false, { message: 'user or psw wrong' });
  }
});

// Configure Passport to use the testing strategy
passport.use('testing', testingStrategy);

describe('Express App', () => {
  it('should return a 401 status for unauthenticated user', async () => {
    const response = await supertest(app).get('/api/sessions/current');
    expect(response.status).toBe(401);
  });

  it('should authenticate and return user data', async () => {
    const response = await supertest(app)
      .post('/api/sessions')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userID: 1, username: 'testuser' });
  });

  // Add more test cases for other routes and scenarios
});


describe('DAO Functions', () => {
  it('should return a user for valid username and password', async () => {
    const user = await dao.getUser('testuser', 'password');
    expect(user).toEqual({ userID: 1, username: 'testuser' });
  });

  it('should handle invalid username or password', async () => {
    const user = await dao.getUser('nonexistent', 'invalidpassword');
    expect(user).toBe(false);
  });

  it('should return a user by ID', async () => {
    const user = await dao.getUserById(1);
    expect(user).toEqual({ userID: 1, username: 'testuser' });
  });

  it('should handle user not found by ID', async () => {
    const user = await dao.getUserById(999);
    expect(user).toEqual({ error: 'Utente non trovato.' });
  });

  // Add more test cases for error handling and other scenarios
});

module.exports = app;
