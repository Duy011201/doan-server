const { isEmpty } = require('../core/func');
const connectDB = require('../config/database');
const setting = require('../config/setting');

const querySQl = async (sql, fields) => {
  return await new Promise((resolve, reject) => {
    // console.log(querySQL, fields);
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

const performSQL = async (option, tableDatabase, fields) => {
  const conditions = [];
  let params = [];
  let sql = '';

  switch (option) {
    case setting.SQL_METHOD.GET:
      sql = `SELECT *
                   FROM ${tableDatabase} as anonymous`;
      break;
    case setting.SQL_METHOD.DELETE:
      sql = `DELETE
                   FROM ${tableDatabase} as anonymous`;
      break;
    case setting.SQL_METHOD.INSERT:
      break;
    case setting.SQL_METHOD.UPDATE:
      const obj = fields.pop();

      // key id
      const objKey = Object.keys(obj)[0];
      const objValue = Object.values(obj)[0];

      const setConditions = fields.map(
        (field) => `anonymous.${Object.keys(field)[0]} = ?`
      );
      const updateParams = fields.map((field) => Object.values(field)[0]);

      params = [...updateParams, objValue];

      sql = `UPDATE ${tableDatabase} as anonymous
                   SET ${setConditions.join(', ')}
                   WHERE anonymous.${objKey} = ?`;
      break;
  }
  if (
    option !== setting.SQL_METHOD.INSERT &&
    option !== setting.SQL_METHOD.UPDATE &&
    !isEmpty(fields)
  ) {
    fields.forEach((field) => {
      const key = Object.keys(field)[0];
      const value = field[key];
      conditions.push(`anonymous.${key} = ?`);
      params.push(value);
    });
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  console.log(sql);

  return await querySQl(sql, params);
};

module.exports = { querySQl, performSQL };
