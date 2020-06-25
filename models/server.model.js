/**
 * table name: server
 * purpose: store server information with key to value relationship
*/

import sql from 'sequelize'
const { DataTypes } = sql

export default {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
