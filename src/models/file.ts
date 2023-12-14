'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

interface FileAttributes {
  id: number;
  fileName: string;
  fileSize: number;
  fileHash: string;
}

interface FileCreationAttributes extends FileAttributes {}

class File extends Model<FileAttributes, FileCreationAttributes>
    implements FileAttributes {
  id!: number;
  fileName!: string;
  fileSize!: number;
  fileHash!: string;
}

module.exports = (sequelize: Sequelize) => {
  File.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        fileName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fileSize: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        fileHash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'File',
      }
  );
  return File;
};