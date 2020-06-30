/**
 * delete a pending record
 * request:
 *   - email: the email address
 *   - purpose: the purpose type of the pending (string)
 * response:
 *   - status: 0 = success, 1 = not exists
 */

import { models } from '../db.js'

const { pending } = models

export const controller = (req, res) => {
  const { email, purpose } = req.body
  if (!email || !purpose) {
    res.status(400).send('invalid usage')
    return
  }
  pending
    .destroy({
      where: { email: email, purpose: purpose },
    })
    .then((number) => {
      res.status(200)
      number > 0 ? res.json({ status: 0 }) : res.json({ status: 1 })
    })
    .catch((reason) => {
      res.status(500).send('error')
    })
}

export const level = 2
