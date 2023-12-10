'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class File extends sequelize_1.Model {
}
module.exports = (sequelize) => {
    File.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        fileName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        fileSize: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false,
        },
        fileHash: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'File',
    });
    return File;
};
