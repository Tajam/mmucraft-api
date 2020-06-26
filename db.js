import fs from 'fs'
import { db } from './config.js'
import sql from 'sequelize'

const { Sequelize } = sql
const db_conf = {
  host: db.host,
  dialect: 'mysql',
  logging: (db.logs === 'true') ? console.log : false
}
const model_postfix = '.model.js'
const sequelize = new Sequelize(db.name, db.user, db.pass, db_conf)

fs
  .readdirSync('./models')
  .filter(file => file.endsWith(model_postfix))
  .map(async file => {
    const { default: model } = await import(`./models/${file}`)
    const table_name = file.slice(0, -model_postfix.length)
    sequelize.define(table_name, model, { timestamps: false, tableName: table_name })
    sequelize.models[table_name].sync()
  })

export const models = sequelize.models
