/**
 * table name: pending
 * purpose: temporary storage for pending registers
 */

import sql from 'sequelize'
const { DataTypes } = sql

export default {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  hash: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}