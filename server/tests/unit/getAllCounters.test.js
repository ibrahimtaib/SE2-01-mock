const request = require('supertest');
const express = require('express');
const app = require('../../index'); // Import your Express app
const dao = require('../../dao'); // Import the mocked dao module

// Mock the DAO function for the specific route
dao.getCounters = jest.fn(async () => [{ /* your mock data here */ }]);

describe('GET /api/counters', () => {
  it('should return counters data', async () => {
    const response = await request(app).get('/api/counters');
    expect(response.status).toBe(200); // Assuming a successful response status code
    expect(response.body).toEqual([{ /* your expected data here */ }]);
  });

  it('should handle internal server errors', async () => {
    // Mock an error in the DAO function
    dao.getCounters = jest.fn(() => {
      throw new Error('Simulated error');
    });

    const response = await request(app).get('/api/counters');
    expect(response.status).toBe(500); // Internal Server Error
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});
