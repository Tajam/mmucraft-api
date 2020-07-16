/**
 * get user information
 * request:
 *   - name: the in-game name of the user
 * response:
 *   - name: the in-game name of the user
 *   - email: registered email address
 *   - status: 0 = exists, 1 = not exists
 */

import { models } from '../db.js'

const { users } = models

export const controller = (req, res) => {
  const { name } = req.body
  if (!name || name === '') {
    res.status(400).send('must supply a non-empty string')
    return
  }
  users
    .findOne({
      where: { username: name.toLowerCase() }
    })
    .then((model) => {
      if (!model) {
        res.status(200).json({ status: 1 })
        return
      }
      res.status(200).json({
        name: model.realname,
        email: model.email,
        status: 0
      })
    })
    .catch((reason) => {
      res.status(500).send('error')
    })
}

export const level = 2
