const connectDB = require('../config/database');

const querySQl = async (sql, fields) => {
  return await new Promise((resolve, reject) => {
    console.log(sql, fields);
    connectDB.query(sql, fields, (error, results) => {
      if (error) {
        console.log('Error executing query:', error.stack);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const queryFieldSQl = async (sql) => {
  return await new Promise((resolve, reject) => {
    console.log(sql);
    connectDB.query(sql, (error, results) => {
      if (error) {
        console.log('Error executing query:', error.stack);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { querySQl };
