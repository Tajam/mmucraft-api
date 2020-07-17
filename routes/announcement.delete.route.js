/**
 * deletes the recorded announcement
 * request:
 *   - id: the discord message id
 * response:
 *   - status: 0 = success, 1 = not exists
 */

import { models } from '../db.js'

const { announcement } = models

export const controller = (req, res) => {
  const { id } = req.body
  if (!id) {
    res.status(400).send('invalid usage')
    return
  }
  announcement
    .destroy({
      where: { id: id },
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

export const level = 2
