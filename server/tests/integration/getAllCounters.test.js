const request = require('supertest');
const app = require('./index'); // Import your Express app
const dao = require('./dao'); // Import your data access object

describe('GET /api/counters', () => {
  it('should return a list of counters', async () => {
    // Mock the dao.getCounters function to return some sample data
    dao.getCounters = jest.fn().mockResolvedValue([
      { counterID: 1, name: 'Counter 1', services_list: 'Service A, Service B' },
      { counterID: 2, name: 'Counter 2', services_list: 'Service C' },
    ]);

    const response = await request(app).get('/api/counters');

    // Check the status code
    expect(response.status).toBe(200);

    // Check the response body
    expect(response.body).toEqual([
      { counterID: 1, name: 'Counter 1', services_list: 'Service A, Service B' },
      { counterID: 2, name: 'Counter 2', services_list: 'Service C' },
    ]);
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock the dao.getCounters function to throw an error
    dao.getCounters = jest.fn().mockRejectedValue(new Error('An error occurred'));

    const response = await request(app).get('/api/counters');

    // Check the status code for an error response
    expect(response.status).toBe(500);

    // Check the response body
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});
