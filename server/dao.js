"use strict";

const sqlite = require("sqlite3");
const crypto = require('crypto');

// open the database
const db = new sqlite.Database("se2-01-mock.sqlite", (err) => {
  if (err) throw err;
});

 db.exec(`DELETE FROM user;
          DELETE FROM config_counters;
          DELETE FROM tickets;
          DELETE FROM services;
          DELETE FROM stats;
          DELETE FROM counters;
        INSERT INTO user(userID ,username, hash, salt, role)
        VALUES(1,'Francesco_User', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 0);
        INSERT INTO user(userID,username, hash, salt, role)
        VALUES(2, 'Jad_Counter', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 1);
        INSERT INTO user(userID, username, hash, salt, role)
        VALUES(3, 'Manar_Counter', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 1);
        INSERT INTO user(userID, username, hash, salt, role)
        VALUES(4, 'Federico_Counter', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 1);
        INSERT INTO user(userID, username, hash, salt, role)
        VALUES(5, 'Ibrahim_Counter', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 1);
        INSERT INTO user(userID, username, hash, salt, role)
        VALUES(6, 'Redon_Admin', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 2);
        INSERT INTO user(userID, username, hash, salt, role)
        VALUES(7, 'Mauro_User', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 0);
        INSERT INTO user(userID ,username, hash, salt, role)
        VALUES(8,'Giovanni_User', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 0);
        INSERT INTO user(userID ,username, hash, salt, role)
        VALUES(9,'Carlo_User', '044629b867bc855e82417ce1dcfad94b15b3a1551cf60ea412f801a94b83f7c5', '72e4eeb14def3b44', 0);
        INSERT INTO services(serviceID, name)
        VALUES(1, 'Customer Issues');
        INSERT INTO services(serviceID, name)
        VALUES(2, 'Account Issues');
        INSERT INTO services(serviceID, name)
        VALUES(3, 'Billing Issues');
        INSERT INTO services(serviceID, name)
        VALUES(4, 'General Problems');
        INSERT OR IGNORE INTO counters(counterID)
        VALUES (1);
        INSERT OR IGNORE INTO counters(counterID)
        VALUES (2);
        INSERT OR IGNORE INTO counters(counterID)
        VALUES (3);
        INSERT OR IGNORE INTO counters(counterID)
        VALUES (4);
        INSERT INTO config_counters(counterID, serviceID, officerID, name)
        VALUES (1, 1, 2, 'Counter 1');
        INSERT INTO config_counters(counterID, serviceID, officerID, name)
        VALUES (2, 2, 3, 'Counter 2');
        INSERT INTO config_counters(counterID, serviceID, officerID, name)
        VALUES (3, 3, 4, 'Counter 3');
        INSERT INTO config_counters(counterID, serviceID, officerID, name)
        VALUES (4, 4, 5, 'Counter 4');
        INSERT INTO tickets(ticketID, serviceID, userID, status)
        VALUES(1, 1, 1, 0);
        INSERT INTO tickets(ticketID, serviceID, userID, status)
        VALUES(2, 2, 7, 0);
        INSERT INTO tickets(ticketID, serviceID, userID, status)
        VALUES(3, 3, 8, 0);
        INSERT INTO tickets(ticketID, serviceID, userID, status)
        VALUES(4, 4, 9, 0);
         `, function(err) {
  if (err) {
    console.error(err.message);
  }
}); 




const databaseFunctions = {

  ///* EOF Login Functions */

  async getUser(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) { reject(err); }
        else if (row === undefined) { resolve(false); }
        else {
          const user = { userID: row.userID, username: row.username, role: row.role };
          const salt = row.salt;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);
            const passwordHex = Buffer.from(row.hash, 'hex');
            if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
              resolve(false);
            else resolve(user);
          });
        }
      });
    });
  },

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE userID = ?';
      db.get(sql, [id], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({ error: 'Utente non trovato.' });
        else {
          const user = { userID: row.userID, username: row.username, role: row.role }
          resolve(user);
        }
      });
    });
  },

  ///* Start of OQM functions */

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
        // FIXME: Dovremmo mettere status TEXT nel db oppure cambiare lo status in 0 pending, 1 done
        db.get(
          `
          SELECT t.ticketID as TicketID
          FROM tickets t
          WHERE t.serviceID = ?    
          AND t.Status = 0
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
          WHERE t.serviceID = ? AND t.status = 0
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
      SELECT counterID, GROUP_CONCAT(services.serviceID,', ') as services_list, userID, username
      FROM config_counters
      JOIN services ON config_counters.serviceID = services.serviceID
      JOIN user ON user.userID = config_counters.officerID
      GROUP BY counterID
      `,
        [],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(new Error("Failed to get counters."));
          } else {
            console.log(rows);
            resolve(
              rows.map((row) => ({
                counterId: row.counterID,
                services: row.services_list.split(", "),
                officer: { officerId: row.userID, username: row.username },
                name: row.username,
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
};

module.exports = databaseFunctions;
