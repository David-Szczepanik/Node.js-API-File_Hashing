// LOCALHOST

require("dotenv").config();

console.log(process.env.DB_USER);

module.exports = {
  "development": {
    "username": 'leaflet_user',
    "password": 'WzvPALzeUowaMa03aGHI6mDKzXmEP9Hb',
    "database": 'nodehasj',
    "host": 'dpg-cpars8m3e1ms739uojkg-a.frankfurt-postgres.render.com',
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
