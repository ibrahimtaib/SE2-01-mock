'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('se2-01-mock.sqlite', (err) => {
  if(err) throw err;
});