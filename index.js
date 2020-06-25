import fs from 'fs'
import { db, settings } from './config.js'
import sql from 'sequelize'
import express from 'express'
import body_parser from 'body-parser'

/**
 * database connection and models definition
 */

const { Sequelize } = sql
const db_conf = {
  host: db.host,
  dialect: 'mysql',
  logging: db.logs === 'true'
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

/**
 * register routes
 */

const app = express()
app.targets = {}

fs
  .readdirSync('./routes')
  .filter(file => file.endsWith('.route.js'))
  .map(async file => {
    const { controller } = await import(`./routes/${file}`)
    const names = file.split('.')
    if (!app.targets[names[1]]) app.targets[names[1]] = {}
    app.targets[names[1]][names[0]] = controller
  })

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.urlencoded())
app.use(express.json())

app.post(`/${settings.prefix}`, (req, res) => {
  const key = req.headers.api
  sequelize.models.apikey.findOne({
    attributes: ['allowCreate', 'allowRead', 'allowUpdate', 'allowDelete'],
    where: { key: key }
  }).then((permission) => {
    permission_check(permission, req, res)
  }).catch((reason) => {
    console.log(reason)
    res.status(500).send('database error')
  })
})
app.listen(settings.port, () => console.log(`MMUC API listening at port ${settings.port}`))

const permission_check = (permission, req, res) => {
  if (!permission) {
    res.status(401).send('invalid access')
    return
  }
  const { action } = req.body
  if (!permission[`allow${action.charAt(0).toUpperCase() + action.slice(1)}`]) {
    res.status(403).send('insufficient permission')
    return
  }
  perform_action(req, res)
}

const perform_action = (req, res) => {
  const { action, target } = req.body
  const controller = app.targets[action][target]
  if (!controller) res.status(404).send('unknown target')
  controller(req, res)
}