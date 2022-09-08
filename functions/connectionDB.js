const mysql = require("mysql");
require("dotenv").config();
const con = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true
});
exports.con = con;
