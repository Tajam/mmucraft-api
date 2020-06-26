/**
 * save a new announcement record, encoded with base64.
 * request:
 *   - id: the discord message id
 *   - author: the author of the message
 *   - date: the create date of the message
 *   - content: the content of the message in plaintext
 * response:
 *   - status: 0 = success, 1 = exists, 2 = failed
 */

import { models } from '../db.js'
import base64 from 'base-64'
import utf8 from 'utf8'

const { announcement } = models

export const controller = (req, res) => {
  const { id, author, date, content } = req.body
  if (!id || !author || !date || !content) {
    res.status(400).json({ status: 2 })
    return
  }
  const content_encoded =  base64.encode(utf8.encode(content))
  announcement
    .findOrCreate({
      where: { id: id },
      defaults: {
        content: content_encoded,
        author: author,
        date: date
      }
    })
    .then(([record, created]) => {
      res.status(200)
      created ? res.json({ status: 0 }) : res.json({ status: 1 })
    })
    .catch((reason) => {
      res.status(500).json({ status: 2 })
    })
}