const request = require('supertest');
const nock = require('nock');
const app = require('../../index'); // Assuming your Express app is in index.js
const dao = require('../../dao');

// Mock the DAO functions to return test data
jest.mock('../../dao', () => ({
  getUser: jest.fn(),
  getUserById: jest.fn(),
}));

describe('Authentication Integration Test', () => {
  beforeEach(() => {
    // Clear any nock interceptors before each test
    nock.cleanAll();
  });

  it('should authenticate a user', async () => {
    dao.getUser.mockResolvedValue({
      userID: 1, // Mock user data
      username: 'testuser',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/sessions')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userID: 1,
      username: 'testuser',
      role: 'user',
    });
  });

  it('should handle authentication failure', async () => {
    dao.getUser.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/sessions')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({});
  });

  // Add more test cases for other authentication routes (e.g., session status check).
});
