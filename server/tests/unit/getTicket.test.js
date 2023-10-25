const request = require("supertest");
const app = require("./index"); // Import your Express app instance
const dao = require("./dao"); // Import the module containing your DAO logic

describe("POST /api/tickets", () => {
  it("should create a ticket and return it", async () => {
    const serviceId = 0; // Replace with a valid service ID

    // Mock the createTicket function to return a mock ticket
    dao.createTicket = jest.fn(() => {
      console.log(serviceId);
      return Promise.resolve({ ticketId: 1, serviceId: serviceId });
    });

    const response = await request(app)
      .post("/api/tickets")
      .send({ serviceId });
    console.log(response);
    // Assert the HTTP response code
    expect(response.status).toBe(200);
    console.log(response.body);
    // Assert the response body contains the expected ticket data
    expect(response.body).toEqual({ ticketId: 1, serviceId: serviceId });

    // Ensure the createTicket function was called with the correct serviceId
    expect(dao.createTicket).toHaveBeenCalledWith(serviceId);
  });

  it("should return an error when serviceId is missing", async () => {
    const response = await request(app).post("/api/tickets").send({});

    // Assert the HTTP response code for missing serviceId
    expect(response.status).toBe(400);

    // Assert the response body contains the expected error message
    expect(response.body).toEqual({ error: "ServiceId is required!" });
  });
});
