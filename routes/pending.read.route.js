/**
 * get basic pending information
 * request:
 *   - token: the pending token string
 *   - purpose: the purpose type of the pending (string)
 * response:
 *   - email: the recorded email address
 *   - status: 0 = exists, 1 = not exists
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
    .findOne({
      where: { hash: token, purpose: purpose }
    })
    .then((model) => {
      if (!model) {
        res.status(200).json({ status: 1 })
        return
      }
      res.status(200).json({
        email: model.email,
        status: 0
      })
    })
    .catch((reason) => {
      console.log(reason)
      res.status(500).send('error')
    })
}
