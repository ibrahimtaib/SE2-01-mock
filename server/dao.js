'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('se2-01-mock.sqlite', (err) => {
  if(err) throw err;
});

async function getNextCustomer(counterId) {
  return new Promise(async (resolve, reject) => {
    try {
      const supportedServiceTypes = await getSupportedServiceTypes(counterId);

      if (supportedServiceTypes.length === 0) {
        // Il banco non gestisce alcun tipo di servizio
        resolve(null);
        return;
      }

      // Qua si deve ancora creare l'azzeramento della lista ogni giorno
      // if (UnNuovoGiorno()) {
      //   await resetQueues();
      // }

      // Trova il tipo di servizio con la coda più lunga
      const queueLengths = await getQueueLengths(supportedServiceTypes);

      if (queueLengths.length === 0) {
        return null; // Nessuna coda disponibile
      }

      let longestQueue = queueLengths[0];

      for (let i = 1; i < queueLengths.length; i++) {
        if (queueLengths[i].queueLength > longestQueue.queueLength ||
            (queueLengths[i].queueLength === longestQueue.queueLength && 
             queueLengths[i].waitingTime < longestQueue.waitingTime)) {
          longestQueue = queueLengths[i];
        }
      }

      // Seleziona il prossimo cliente nella coda del tipo di servizio con la coda più lunga
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
            customerID: row.CustomerID,
            ticketID: row.TicketID
          };
          resolve(customer);
        } else {
          // Nessun cliente trovato nella coda del banco specificato e del tipo di servizio con la coda più lunga
          resolve(null);
        }
      }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Funzione per ottenere i tipi di servizio supportati da un banco specifico
async function getSupportedServiceTypes(counterId) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT *
      FROM counters c
      WHERE c.counterID = ?
    `, [counterId], (err, rows) => {
      if (err) {
        reject(new Error('Failed to get supported service types.'));
      } else {
        const supportedServiceTypes = rows.map(row => row.serviceID);
        resolve(supportedServiceTypes);
      }
    });
  });
}

// Funzione per ottenere le lunghezze delle code per ciascun tipo di servizio
async function getQueueLengths(supportedServiceTypes) {
  return new Promise((resolve, reject) => {
    const queueLengths = [];

    // Per ogni tipo di servizio supportato, calcola la lunghezza della coda
    for (const serviceType of supportedServiceTypes) {
      db.get(`
        SELECT COUNT(t.ticketID) as QueueLength, s.waitingTime as ServiceTime
        FROM tickets t
        INNER JOIN services s ON t.serviceID = s.serviceID
        WHERE t.serviceID = ? AND t.status = 'waiting'
      `, [serviceType], (err, row) => {
        if (err) {
          reject(new Error('Failed to get queue lengths.'));
        } else {
          queueLengths.push({
            serviceType: serviceType,
            queueLength: row.QueueLength || 0,
            waitingTime: row.ServiceTime 
          });

          // Se abbiamo ottenuto lunghezze per tutti i tipi di servizio, risolviamo la promessa
          if (queueLengths.length === supportedServiceTypes.length) {
            resolve(queueLengths);
          }
        }
      });
    }
  });
}


