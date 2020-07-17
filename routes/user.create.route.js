/**
 * creates a new user account
 * request:
 *   - name: the in-game name of the user
 *   - password: the password either in plaintext
 *   - token: the pending token for new account
 * response:
 *   - status: 0 = success, 1 = token not exists, 2 = username not allowed, 3 = username or email exists
 */

import { models } from '../db.js'
import { generateSalt, hashPassword } from '../utils/algorithm.js'
import sql from 'sequelize'

const { users, pending } = models
const { Op } = sql

export const controller = (req, res) => {
  const { name, password, token } = req.body
  if (!name || !password || !token) {
    res.status(400).send('invalid usage')
    return
  }
  if (!/^[A-Za-z0-9_]+$/.test(name)) {
    res.status(200).json({ status: 2 })
    return
  }
  pending
    .findOne({
      where: { [Op.and]: [{ hash: token }, { purpose: 'invite' }] }
    })
    .then((model_p) => {
      if (!model_p) {
        res.status(200).json({ status: 1 })
        return
      }
      const { email } = model_p
      const username = name.toLowerCase()
      const salt = generateSalt(16)
      const hashed_password = hashPassword(password, salt)
      const formatted_password = `\$SHA\$${salt}\$${hashed_password}`
      users
        .findOrCreate({
          where: { [Op.or]: [{ email: email }, { username: username }] },
          defaults: {
            realname: name,
            username: username,
            email: email,
            password: formatted_password,
            regdate: Date.now()
          }
        })
        .then(([model_u, created]) => {
          if (!created) {
            res.status(200).json({ status: 3 })
            return
          }
          model_p.destroy()
          res.status(200).json({ status: 0 })
        })
        .catch((reason) => {
          console.log(reason)
          res.status(500).send('error')
        })
    })
    .catch((reason) => {
      console.log(reason)
      res.status(500).send('error')
    })
}
