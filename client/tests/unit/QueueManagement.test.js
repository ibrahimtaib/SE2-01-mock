const dao = require('./dao'); // Import your DAO module
const sqlite3 = require('sqlite3'); // Import the SQLite library or a mock if needed

describe('createTicket', () => {
  it('creates a ticket successfully', async () => {
    const mockDb = new sqlite3.Database(':memory:'); // Use an in-memory database for testing

    const serviceId = 1; // Replace with a valid serviceId

    // Mock the database run function to resolve with a result
    mockDb.run = jest.fn((sql, params, callback) => {
      callback(null); // Simulate a successful database operation
    });

    // Replace the original DAO database with the mock
    dao.setDatabase(mockDb);

    // Call the createTicket function
    const ticket = await dao.createTicket(serviceId);

    expect(ticket).toEqual({
      ticketId: expect.any(Number),
      serviceId,
    });
  });

  it('handles errors during ticket creation', async () => {
    const mockDb = new sqlite3.Database(':memory:'); // Use an in-memory database for testing

    const serviceId = 1; // Replace with a valid serviceId

    // Mock the database run function to reject with an error
    mockDb.run = jest.fn((sql, params, callback) => {
      callback(new Error('Database error')); // Simulate a database error
    });

    // Replace the original DAO database with the mock
    dao.setDatabase(mockDb);

    // Call the createTicket function and expect it to reject with an error
    await expect(dao.createTicket(serviceId)).rejects.toThrowError('Failed to create ticket.');
  });
});

