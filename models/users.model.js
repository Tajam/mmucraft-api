/**
 * table name: users
 * purpose: contain information and sensitive data of all users
 */

import sql from 'sequelize'
const { DataTypes } = sql

export default {
  id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  realname: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  lastlogin: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  x: {
    type: "DOUBLE",
    allowNull: false,
    defaultValue: '0'
  },
  y: {
    type: "DOUBLE",
    allowNull: false,
    defaultValue: '0'
  },
  z: {
    type: "DOUBLE",
    allowNull: false,
    defaultValue: '0'
  },
  world: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'world'
  },
  regdate: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: '0'
  },
  regip: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  yaw: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  pitch: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isLogged: {
    type: DataTypes.INTEGER(6),
    allowNull: false,
    defaultValue: '0'
  },
  hasSession: {
    type: DataTypes.INTEGER(6),
    allowNull: false,
    defaultValue: '0'
  },
  totp: {
    type: DataTypes.STRING(16),
    allowNull: true
  }
}