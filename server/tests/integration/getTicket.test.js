const request = require('supertest');
const app = require('../../index'); // Assuming your Express app is in 'index.js'

describe('Integration Test for /api/tickets', () => {
  it('should create a ticket', (done) => {
    const requestBody = {
      serviceId: 1, // Replace with the appropriate serviceId
    };

    request(app)
      .post('/api/tickets')
      .send(requestBody)
      .expect(200) // Set the expected HTTP status code
      .end((err, res) => {
        if (err) return done(err);

        // Add assertions for the response body as needed
        expect(res.body).toHaveProperty('ticketId');

        done();
      });
  });

  it('should return an error for missing serviceId', (done) => {
    const requestBody = {
      // Missing serviceId
    };

    request(app)
      .post('/api/tickets')
      .send(requestBody)
      .expect(400) // Set the expected HTTP status code for missing serviceId
      .end((err, res) => {
        if (err) return done(err);

        // Add assertions for the response body as needed
        expect(res.body).toHaveProperty('error', 'ServiceId is required!');

        done();
      });
  });
});
