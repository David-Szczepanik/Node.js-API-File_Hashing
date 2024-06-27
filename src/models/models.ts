'use strict';
require('dotenv').config();

import fs from "fs";
import path from "path";

const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db: any = {};

// LOCALHOST
// const env = process.env.NODE_ENV || 'test';
// const config = require(__dirname + '/../config/config')[env];
//
// let sequelize: any;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// Render DB
const sequelize = new Sequelize('leaflet_tzz5', 'leaflet_user', 'PbJGtMcE8DGs480CR7WnIvsJqcfi03mU', {
  host: 'dpg-cpul9glds78s73dvegi0-a.frankfurt-postgres.render.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true
    }
  }
});

sequelize.authenticate()
  .then(() => console.log('Connected to Render DB!'))
  .catch((error: any) => console.error('Unable to connect to the database:', error));

// sequelize.close();


// Load all models
fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.ts' &&
          file.indexOf('.test.ts') === -1
      );
    })
    .forEach((file: any) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
        // console.log(__dirname, file);
    });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const FileModel = require('./file')(sequelize);
db.File = FileModel;

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
