const request = require('supertest');
const express = require('express');
const app = require('../../index'); // Import your Express app
const dao = require('../../dao');

describe('GET /api/services', () => {
  it('should return a JSON response with services if dao.getServices succeeds', async () => {
    // Mock the dao.getServices function to return a sample result
    dao.getServices = jest.fn().mockResolvedValue([{ name: 'Service A' }, { name: 'Service B' }]);

    const response = await request(app).get('/api/services');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ name: 'Service A' }, { name: 'Service B' }]);
  });

//   it('should return a 404 response if dao.getServices returns an error', async () => {
//     // Mock the dao.getServices function to return an error
//     dao.getServices = jest.fn().mockRejectedValue(new Error('Failed to get services.'));

//     const response = await request(app).get('/api/services');

//     expect(response.statusCode).toBe(404);
//     expect(response.body).toEqual({ error: 'Failed to get services.' });
//   });
// errors are not resolve

  it('should return a 500 response if an exception is thrown during the route handler', async () => {
    // Mock the dao.getServices function to throw an exception
    dao.getServices = jest.fn().mockRejectedValue(new Error('Simulated exception'));

    const response = await request(app).get('/api/services');

    expect(response.statusCode).toBe(500);
  });
});
