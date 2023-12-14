'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Sequelize = require('sequelize');
const basename = path_1.default.basename(__filename);
const db = {};
// LOCALHOST
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config')[env];
// let sequelize: any;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
// PLANETSCALE
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true
        }
    }
});
sequelize.authenticate()
    .then(() => console.log('Connected to PlanetScale!'))
    .catch((error) => console.error('Unable to connect to the database:', error));
// sequelize.close();
// Load all models
fs_1.default
    .readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.ts' &&
        file.indexOf('.test.ts') === -1);
})
    .forEach((file) => {
    const model = require(path_1.default.join(__dirname, file))(sequelize, Sequelize.DataTypes);
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
exports.default = db;
