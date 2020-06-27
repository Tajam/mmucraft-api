/**
 * table name: apikey
 * purpose: contains all the api key records and permission integers
 */

import sql from 'sequelize'
const { DataTypes } = sql

export default {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  create: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  read: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  update: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  delete: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  }
}