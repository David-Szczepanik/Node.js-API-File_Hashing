"use strict";
// LOCALHOST
require("dotenv").config();
console.log(process.env.DB_USER);
module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.HOST,
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": "admin",
        "database": "sequelizeFiles",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
};
