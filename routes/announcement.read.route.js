/**
 * get the announcement data
 * request:
 *   - id: the discord message id
 * response:
 *   - id: the discord message id
 *   - author: the author of the message
 *   - date: the create date of the message
 *   - content: the content of the message in plaintext
 *   - status: 0 = success, 1 = not exists
 */

import { models } from '../db.js'
import base64 from 'base-64'
import utf8 from 'utf8'

const { announcement } = models

export const controller = (req, res) => {
  const { id } = req.body
  if (!id) {
    res.status(400).send('invalid usage')
    return
  }
  announcement
    .findOne({
      where: { id: id }
    })
    .then((model) => {
      if (!model) {
        res.status(200).json({ status: 1 })
        return
      }
      const { id, author, date, content } = model
      const content_decoded = utf8.decode(base64.decode(content))
      res.status(200).json({
        id : id,
        author: author,
        date: date,
        content: content_decoded,
        status: 0
      })
    })
    .catch((reason) => {
      res.status(500).send('error')
    })
}
