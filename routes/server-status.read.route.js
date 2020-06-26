/**
 * get the server status
 * request:
 *   - name: the name of the server
 * response:
 *   - name: the name of the server
 *   - version: the version of minecraft
 *   - current_players: the online player count
 *   - max_players: max player capacity of the server
 *   - status: 0 = online, 1 = offline, 2 = error
 */

import { server_port } from '../config.js'
import { getStats } from '../utils/minestat.js'

export const controller = (req, res) => {
  try {
    const { name } = req.body
    const port = server_port[name]
    if (!port) {
      res.status(400).send('invalid server name')
      return
    }
    getStats(port, (online, stats) => {
      if (!online) {
        res.status(200).json({ status: 1 })
        return
      }
      const { version, current_players, max_players } = stats
      res.status(200).json({
        name,
        version,
        current_players,
        max_players,
        status: 0
      })
    })
  } catch (e) {
    res.status(500).json({ status: 2 })
  }
}
