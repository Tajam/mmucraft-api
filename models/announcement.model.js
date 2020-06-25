/**
 * table name: announcement
 * purpose: contain announcement content posted in the discord server
 */

import sql from 'sequelize'
const { DataTypes } = sql

export default {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  content: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}