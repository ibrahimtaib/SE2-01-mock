const request = require('supertest');
const app = require('../../index'); // Assuming this is your Express app

describe('POST /api/tickets', () => {
  it('should create a ticket and return it', (done) => {
    const serviceId = 123; // Provide a valid serviceId here

    request(app)
      .post('/api/tickets')
      .send({ serviceId })
      .expect(200) // Expect a successful response code
      .expect('Content-Type', /json/) // Expect a JSON response
      .end((err, res) => {
        if (err) return done(err);

        // Assert the response structure or values
        expect(res.body).toHaveProperty('ticketId');
        expect(res.body).toHaveProperty('serviceId','');////I need to know which is the value received

        done();
      });
  });

  it('should handle missing serviceId', (done) => {
    request(app)
      .post('/api/tickets')
      .send({}) // Missing serviceId
      .expect(400) // Expect a 400 Bad Request response
      .expect('Content-Type', /json/) // Expect a JSON response
      .end((err, res) => {
        if (err) return done(err);

        // Assert the error message
        expect(res.body).toHaveProperty('error', 'ServiceId is required!');

        done();
      });
  });
});
