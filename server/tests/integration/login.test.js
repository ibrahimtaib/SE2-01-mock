const request = require('supertest');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const app = require('../../index'); // Your Express app
const dao = require('../../dao'); // Mocked or stubbed DAO
const { mockLogin, mockLogout, mockAuthenticatedSession } = require('./test-utils'); // Custom test utilities

// Set up an in-memory store for session data (you can use a real store in a more complex setup).
const MemoryStore = require('memorystore')(session);
const memoryStore = new MemoryStore({
  checkPeriod: 86400000, // prune expired entries every 24h
});

// Mock Passport user serialization/deserialization.
passport.serializeUser((user, done) => done(null, user.userID));
passport.deserializeUser(async (id, done) => {
  const user = await dao.getUserById(id);
  done(null, user);
});

app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());

describe('Integration Tests', () => {
  beforeAll(() => {
    // Initialize the Express app and set up test environment, e.g., use a different database for testing.
    // Mock the `dao` functions to return test data.
  });

  afterAll(() => {
    // Clean up resources, e.g., close the database connection.
  });

  it('should allow a valid login', async () => {
    const agent = request.agent(app); // This will maintain the session.

    // Mock login using custom test utilities.
    const user = await mockLogin(agent);

    expect(user).toBeTruthy();
  });

  it('should handle invalid login', async () => {
    const agent = request.agent(app);

    // Mock login with incorrect credentials.
    const user = await mockLogin(agent, 'invalidUser', 'invalidPassword');

    expect(user).toBeFalsy();
  });

  it('should handle missing username and password', async () => {
    const agent = request.agent(app);

    // Mock login with missing credentials.
    const user = await mockLogin(agent, '', '');

    expect(user).toBeFalsy();
  });

  it('should get current session', async () => {
    const agent = request.agent(app);

    // Mock login.
    await mockLogin(agent);

    // Get the current session.
    const response = await agent.get('/api/sessions/current');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userID');
  });

  it('should log out', async () => {
    const agent = request.agent(app);

    // Mock login.
    await mockLogin(agent);

    // Log out.
    const response = await mockLogout(agent);

    expect(response.statusCode).toBe(200);
  });
});

// Custom test utilities

// Example of a custom test utility for login.
async function mockLogin(agent, username = 'testUser', password = 'testPassword') {
  return new Promise(async (resolve) => {
    const response = await agent
      .post('/api/sessions')
      .send({ username, password })
      .set('Accept', 'application/json');

    resolve(response.body);
  });
}

// Example of a custom test utility for logout.
async function mockLogout(agent) {
  return new Promise(async (resolve) => {
    const response = await agent.delete('/api/sessions/current').set('Accept', 'application/json');

    resolve(response);
  });
}
