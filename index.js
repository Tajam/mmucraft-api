import fs from 'fs'
import express from 'express'
import body_parser from 'body-parser'
import { settings } from './config.js'
import { models } from './db.js'

const app = express()
app.targets = {}

fs
  .readdirSync('./routes')
  .filter(file => file.endsWith('.route.js'))
  .map(async file => {
    const { controller, level } = await import(`./routes/${file}`)
    const names = file.split('.')
    if (!app.targets[names[1]]) app.targets[names[1]] = {}
    app.targets[names[1]][names[0]] = { controller, level: level || 1 }
  })

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.urlencoded())
app.use(express.json())

app.post(`/${settings.prefix}`, (req, res) => {
  const key = req.headers.api
  const { action, target } = req.body
  if (!key || !action || !target ) {
    res.status(400).send('invalid format')
    return
  }
  models.apikey.findOne({
    attributes: ['create', 'read', 'update', 'delete'],
    where: { key: key }
  }).then((permission) => {
    if (!permission) {
      res.status(401).send('invalid access')
      return
    }
    const perm_level = permission[action]
    if (perm_level === undefined) {
      res.status(404).send('unknown action')
      return
    }
    const { controller, level } = app.targets[action][target]
    if (!controller) {
      res.status(404).send('unknown target')
      return
    }
    if (level > perm_level) {
      res.status(401).send('insufficient permission')
      return
    }
    controller(req, res)
  }).catch((reason) => {
    console.log(reason)
    res.status(500).send('database error')
  })
})

app.listen(settings.port, () => console.log(`MMUC API listening at port ${settings.port}`))

// hi i am casey