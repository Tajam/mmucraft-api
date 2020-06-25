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
  allowCreate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allowRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allowUpdate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allowDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}