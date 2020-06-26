/**
 * deletes the recorded announcement
 * request:
 *   - id: the discord message id
 * response:
 *   - status: 0 = success, 1 = not exists, 2 = failed
 */

import { models } from '../db.js'

const { announcement } = models

export const controller = (req, res) => {
  const { id } = req.body
  if (!id) {
    res.status(400).json({ status: 2 })
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
      res.status(500).json({ status: 2 })
    })
}
