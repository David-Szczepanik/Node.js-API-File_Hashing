// LOCALHOST

require("dotenv").config();

console.log(process.env.DB_USER);

module.exports = {
  "development": {
    "username": 'leaflet_user',
    "password": 'PbJGtMcE8DGs480CR7WnIvsJqcfi03mU',
    "database": 'nodehash',
    "host": 'dpg-cpul9glds78s73dvegi0-a.frankfurt-postgres.render.com',
    "dialect": 'postgres'
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
}
