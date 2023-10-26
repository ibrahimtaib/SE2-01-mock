"use strict";

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("se2-01-mock.sqlite", (err) => {
  if (err) throw err;
});

const databaseFunctions = {
  async getNextCustomer(counterId) {
    return new Promise(async (resolve, reject) => {
      try {
        const supportedServiceTypes = await this.getSupportedServiceTypes(
          counterId
        );

        if (supportedServiceTypes.length === 0) {
          resolve(null);
          return;
        }

        // Qua si deve ancora creare l'azzeramento della lista ogni giorno
        // if (UnNuovoGiorno()) {
        //   await resetQueues();
        // }

        const queueLengths = await this.getQueueLengths(supportedServiceTypes);

        if (queueLengths.length === 0) {
          return null;
        }

        let longestQueue = queueLengths[0];

        for (let i = 1; i < queueLengths.length; i++) {
          if (
            queueLengths[i].queueLength > longestQueue.queueLength ||
            (queueLengths[i].queueLength === longestQueue.queueLength &&
              queueLengths[i].waitingTime < longestQueue.waitingTime)
          ) {
            longestQueue = queueLengths[i];
          }
        }

        db.get(
          `
          SELECT t.ticketID as TicketID
          FROM tickets t
          WHERE t.serviceID = ?    
          AND t.Status = 'waiting'
          ORDER BY t.ticketID ASC
          LIMIT 1
          `,
          [longestQueue.serviceType],
          (err, row) => {
            if (err) {
              reject(new Error("Failed to get the next customer."));
            } else {
              if (row) {
                const customer = {
                  customerID: row.CustomerID,
                  ticketID: row.TicketID,
                };
                resolve(customer);
              } else {
                resolve(null);
              }
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  },

  async getSupportedServiceTypes(counterId) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT *
        FROM counters c
        WHERE c.counterID = ?
      `,
        [counterId],
        (err, rows) => {
          if (err) {
            reject(new Error("Failed to get supported service types."));
          } else {
            const supportedServiceTypes = rows.map((row) => row.serviceID);
            resolve(supportedServiceTypes);
          }
        }
      );
    });
  },

  async getQueueLengths(supportedServiceTypes) {
    return new Promise((resolve, reject) => {
      const queueLengths = [];

      for (const serviceType of supportedServiceTypes) {
        db.get(
          `
          SELECT COUNT(t.ticketID) as QueueLength, s.waitingTime as ServiceTime
          FROM tickets t
          INNER JOIN services s ON t.serviceID = s.serviceID
          WHERE t.serviceID = ? AND t.status = 'waiting'
        `,
          [serviceType],
          (err, row) => {
            if (err) {
              reject(new Error("Failed to get queue lengths."));
            } else {
              queueLengths.push({
                serviceType: serviceType,
                queueLength: row.QueueLength || 0,
                waitingTime: row.ServiceTime,
              });

              if (queueLengths.length === supportedServiceTypes.length) {
                resolve(queueLengths);
              }
            }
          }
        );
      }
    });
  },

  async getServices() {
    return new Promise((resolve, reject) => {
      db.all(
        `
          SELECT *
          FROM services
          `,
        (err, rows) => {
          if (err) {
            reject(new Error("Failed to get services."));
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  async getCounters() {
    return new Promise((resolve, reject) => {
      db.all(
        `
      SELECT counterID, GROUP_CONCAT(services.serviceID,', ') as services_list, officerID
      FROM config_counters
      JOIN services ON config_counters.serviceID = services.serviceID
      GROUP BY counterID
      `,
        [],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(new Error("Failed to get counters."));
          } else {
            resolve(
              rows.map((row) => ({
                counterId: row.counterID,
                services: row.services_list.split(", "),
              }))
            );
          }
        }
      );
    });
  },

  async createTicket(serviceId) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO tickets (serviceID, status)
        VALUES (?, '0')
      `,
        [serviceId],
        function (err) {
          if (err) {
            reject(new Error("Failed to create ticket."));
          } else {
            resolve({ ticketId: this.lastID, serviceId });
          }
        }
      );
    });
  },

  async createService(serviceName) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO services (name) 
        VALUES (?)
        `,
        [serviceName],
        function (err) {
          if (err) {
            reject(new Error("Failed to create service."));
          } else {
            resolve({ serviceID: this.lastID, name: serviceName });
          }
        }
      );
    });
  },

  /*
  async addServiceToCounter(counterID, serviceID) {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT OR IGNORE INTO config_counters(counterID, serviceID)
        VALUES (?, ?)
        `,
        [counterID, serviceID],
        function (err) {
          if (err) {
            console.error(err);
            reject(new Error("Failed."));
          } else(
            resolve({ counterID: counterID, serviceID: serviceID })
            );
        }
      );
    });
  }  */
  async addServiceToCounter_bis(counters, services) {
    //counters: array of counterIds
    //services: array of serviceIds
    console.log("here");
    return new Promise((resolve, reject) => {
      let SQL =
        "INSERT OR IGNORE INTO config_counters(counterID, serviceID) VALUES ";

      // add multiple values in a single query
      counters.forEach((counter) => {
        services.forEach((service) => {
          SQL += `(${counter}, ${service}),`;
        });
      });
      // remove last comma
      SQL = SQL.slice(0, -1);
      db.run(SQL, function (err) {
        if (err) {
          reject(new Error("Creation failed"));
        } else resolve({ message: "Services added successfully!" });
      });
    });
  },

  async deleteServiceFromCounter_bis(counters, services) {
    const SQL = `DELETE FROM config_counters WHERE counterID IN (${counters}) AND serviceID IN (${services})`;
    return new Promise((resolve, reject) => {
      db.run(SQL, function (err) {
        if (err) reject(new Error("Deletion failed"));
        else resolve({ message: "Services removed successfully!" });
      });
    });
  },
  async addServiceToCounter(counterID, serviceID) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT serviceID FROM config_counters WHERE counterID = ?",
        counterID,
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            let newServiceID;
            if (row) {
              const serviceArray = row.serviceID
                ? row.serviceID.split(",")
                : [];
              if (!serviceArray.includes(serviceID)) {
                newServiceID = row.serviceID
                  ? row.serviceID + "," + serviceID
                  : serviceID;
                db.run(
                  "DELETE FROM config_counters WHERE counterID = ?",
                  counterID,
                  (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      db.run(
                        "INSERT INTO config_counters (counterID, serviceID) VALUES (?, ?)",
                        counterID,
                        newServiceID,
                        (err) => {
                          if (err) {
                            reject(err);
                          } else {
                            resolve("Row replaced successfully");
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                resolve("Service already exists for this counterID");
              }
            } else {
              db.run(
                "INSERT INTO config_counters (counterID, serviceID) VALUES (?, ?)",
                counterID,
                serviceID,
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve("Row inserted successfully");
                  }
                }
              );
            }
          }
        }
      );
    });
  },

  async deleteServices(counterID) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM config_counters WHERE counterID = ?",
        [counterID],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve("success");
          }
        }
      );
    });
  },
};

module.exports = databaseFunctions;
