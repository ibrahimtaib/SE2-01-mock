"use strict";

const sqlite = require("sqlite3");
const crypto = require('crypto');

// open the database
const db = new sqlite.Database("se2-01-mock.sqlite", (err) => {
  if (err) throw err;
});




const databaseFunctions = {

  ///* EOF Login Functions */

  async getUser(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
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
      const sql = 'SELECT * FROM users WHERE userID = ?';
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
        if (queueLengths[i].queueLength > longestQueue.queueLength ||
            (queueLengths[i].queueLength === longestQueue.queueLength && 
             queueLengths[i].waitingTime < longestQueue.waitingTime)) {
          longestQueue = queueLengths[i];
        }
      }
        
      db.get(`
      SELECT t.ticketID as TicketID
      FROM tickets t
      WHERE t.serviceID = ?    
      AND t.Status = 'waiting'
      ORDER BY t.ticketID ASC
      LIMIT 1
      `, [longestQueue.serviceType], (err, row) => {
      if (err) {
        reject(new Error('Failed to get the next customer.'));
      } else {
        if (row) {
          const customer = {
            ticketID: row.TicketID
          };
          resolve(customer);
        } else {
          resolve(null);
        }
      }
      });
    } catch (error) {
      reject(error);
    }
  });
}

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
      });
    }
  });
}

async function resetQueues() {
  try {
    // Da valutare se eliminare tutti gli elementi o cambiare semplicemente lo status in modo da non eliminare i dati
    // Devo ancora creare un timer che scade a mezzanotte che fa partire resetQueues
    db.run(`
      DELETE FROM tickets
    `);

    console.log('Code azzerate con successo.');
  } catch (error) {
    console.error('Errore azzeramento delle code:', error);
  }
}

exports.getNextCustomer = getNextCustomer;


