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
            if (err){
              reject(new Error("Failed to get services."));
            } else{
              resolve(rows)
            }
        })
    })
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
};



/*da correggere
getCounters(){
  return new Promise((resolve, reject) => {
    db.all(`
    SELECT *
    FROM counters
    `,
    [], (err, rows) => {
      if (err) {
        reject(new Error("Failed to get counters."));
      } 
      rows.forEach(row => {
        if (row == undefined) {
          resolve({ error: '' });
        } else {
          const arrayCounters = rows.map((row) => row.counterId)
          resolve(arrayCounters);
        }
      });
    });
  });
};
*/

module.exports = databaseFunctions;
