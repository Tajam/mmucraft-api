/**
 * update the content of the edited announcement
 * request:
 *   - id: the discord message id
 *   - content: the content of the message in plaintext
 * response:
 *   - status: 0 = success, 1 = not exists, 2 = failed
 */

import { models } from '../db.js'
import base64 from 'base-64'
import utf8 from 'utf8'

const { announcement } = models

export const controller = (req, res) => {
  const { id, content } = req.body
  if (!id || !content) {
    res.status(400).json({ status: 2 })
    return
  }
  const content_encoded =  base64.encode(utf8.encode(content))
  announcement
    .update(
      { content: content_encoded },
      { where: { id: id } }
    )
    .then((number) => {
      res.status(200)
      number > 0 ? res.json({ status: 0 }) : res.json({ status: 1 })
    })
    .catch((reason) => {
      res.status(500).json({ status: 2 })
    })
}
