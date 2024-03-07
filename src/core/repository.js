const connectDB = require("../config/database");

const query = async (querySQL, fields) => {
    return await new Promise((resolve, reject) => {
        // console.log(querySQL, fields);
        connectDB.query(querySQL, fields, (err, results, fields) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {query};