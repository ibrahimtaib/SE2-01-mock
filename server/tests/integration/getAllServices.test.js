const request = require('supertest');
const app = require('../../index'); // Import your Express.js app instance
const dao = require('../../dao'); // Import your data access module

describe('GET /api/services', () => {
  it('should return a list of services', async () => {
    // Define a mock response from your data access module
    const mockServices = [{ id: 1, name: 'Service 1' }, { id: 2, name: 'Service 2' }];
    dao.getServices = jest.fn().mockResolvedValue(mockServices);

    // Make a GET request to your endpoint using supertest
    const response = await request(app).get('/api/services');

    // Assert that the response status code is 200 (OK)
    expect(response.status).toBe(200);

    // Assert that the response body matches your expected data
    expect(response.body).toEqual(mockServices);
  });

  it('should handle errors and return a 500 status', async () => {
    // Mock an error response from your data access module
    dao.getServices = jest.fn().mockRejectedValue(new Error('Database error'));

    // Make a GET request to your endpoint using supertest
    const response = await request(app).get('/api/services');

    // Assert that the response status code is 500 (Internal Server Error)
    expect(response.status).toBe(500);
  });
});
