/**
 * delete a pending record
 * request:
 *   - token: the pending token string
 *   - purpose: the purpose type of the pending (string)
 * response:
 *   - status: 0 = success, 1 = not exists
 */

import { models } from '../db.js'

const { pending } = models

export const controller = (req, res) => {
  const { token, purpose } = req.body
  if (!token || !purpose) {
    res.status(400).send('invalid usage')
    return
  }
  pending
    .destroy({
      where: { hash: token, purpose: purpose },
    })
    .then((number) => {
      res.status(200)
      number > 0 ? res.json({ status: 0 }) : res.json({ status: 1 })
    })
    .catch((reason) => {
      console.log(reason)
      res.status(500).send('error')
    })
}
