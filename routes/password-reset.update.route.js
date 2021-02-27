/**
 * update user password
 * request:
 *   - password: new password in plaintext
 *   - token: the pending token for password reset
 * response:
 *   - status: 0 = success, 1 = token not exists, 2 = password too short, 3 = user not exists
 */

import { models } from '../db.js'
import { generateSalt, hashPassword } from '../utils/algorithm.js'
import sql from 'sequelize'

const { users, pending } = models
const { Op } = sql

export const controller = (req, res) => {
  const { password, token } = req.body
  if (!password || !token) {
    res.status(400).send('invalid usage')
    return
  }
  if (password.length < 5) {
    res.status(200).json({ status: 2 })
    return
  }
  pending
    .findOne({
      where: { [Op.and]: [{ hash: token }, { purpose: 'password-reset' }] }
    })
    .then((model_p) => {
      if (!model_p) {
        res.status(200).json({ status: 1 })
        return
      }
      const { email } = model_p
      const salt = generateSalt(16)
      const hashed_password = hashPassword(password, salt)
      const formatted_password = `\$SHA\$${salt}\$${hashed_password}`
      users
        .update(
          { password: formatted_password },
          { where: { email: email } }
        )
        .then((number) => {
          res.status(200)
          number > 0 ? res.json({ status: 0 }) : res.json({ status: 3 })
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
