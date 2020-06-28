/**
 * get uuid from supplied player name
 * request:
 *   - name: player name
 * response:
 *   - uuid: the generated uuid
 */

import { uuidConstruct } from '../utils/algorithm.js'

export const controller = (req, res) => {
  const { name } = req.body
  if (!name || name === '') {
    res.status(400).send('must supply a non-empty string')
    return
  }
  try {
    const uuid = uuidConstruct(name)
    res.status(200).json({ uuid: uuid })
  } catch (e) {
    res.status(500).send('error')
  }
}
