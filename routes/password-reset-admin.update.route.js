/**
 * update user password
 * request:
 *   - name: the in-game name of the user
 * response:
 *   - status: 0 = success, 1 = user not exists, 2 = email not send
 */

import { models } from '../db.js'
import { generateSalt, hashPassword } from '../utils/algorithm.js'
import { passwordNewSendMail } from '../utils/mailer/index.js'
import Hashids from 'hashids'

const { users } = models
const hashids = new Hashids(settings.master_key, 20)

export const controller = (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(400).send('invalid usage')
    return
  }
  const password = hashids.encode(Date.now());
  const salt = generateSalt(16)
  const hashed_password = hashPassword(password, salt)
  const formatted_password = `\$SHA\$${salt}\$${hashed_password}`
  users
    .findOne(
      { where: { username: name.toLowerCase() } }
    )
    .then((model) => {
      res.status(200)
      if (model) {
        const { email } = model;
        passwordNewSendMail(password, email, (sent) => {
          if (!sent) {
            res.json({ status: 2 })
            return
          }
          model.password = formatted_password
          model.save()
          res.json({ status: 0 })
        })
      } else {
        res.json({ status: 1 })
      }
    })
    .catch((reason) => {
      console.log(reason)
      res.status(500).send('error')
    })
}

export const level = 2
