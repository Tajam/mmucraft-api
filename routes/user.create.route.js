/**
 * creates a new user account
 * request:
 *   - name: the in-game name of the user
 *   - password:
 *     - content: the password either in raw text or hashed form
 *     - hashed: indicate whether the password is hashed or not
 *   - token: the pending token for new account
 * response:
 *   - status: 0 = success, 1 = token not exists, 2 = username or email exists
 */

import { models } from '../db.js'
// import { generateSalt, hashPassword } from '../utils/algorithm.js'
import sql from 'sequelize'

const { users, pending } = models
const { Op } = sql

export const controller = (req, res) => {
  const { name, password, token } = req.body
  if (!name || !password || !token) {
    res.status(400).send('invalid usage')
    return
  }
  pending
    .findOne({
      where: { token: token, purpose: 'invite' }
    })
    .then((model_p) => {
      if (!model_p) {
        res.status(200).json({ status: 1 })
        return
      }
      const { email } = model_p
      const { username } = name.toLowerCase()
      const salt = generateSalt(16)
      const {hashed, content} = password
      const hashed_password = hashed ? content : hashPassword(content, salt)
      users
        .findOrCreate({
          where: { [Op.or]: [{ email: email }, { username: username }] },
          defaults: {
            realname: name,
            username: username,
            email: email,
            password: hashed_password,
            regdate: Date.now()
          }
        })
        .then(([model_u, created]) => {
          if (!created) {
            res.status(200).json({ status: 2 })
            return
          }
          model_p.destroy()
          res.status(200).json({ status: 0 })
        })
        .catch((reason) => {
          res.status(500).send('error')
        })
    })
    .catch((reaons) => {
      res.status(500).send('error')
    })
}
