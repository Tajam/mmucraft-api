/**
 * get a list of online player
 * request:
 * response:
 *   - players: a list of online players (random shuffled)
 */

import { models } from '../db.js'
import { shuffle } from '../utils/algorithm.js'

const { users } = models

export const controller = (req, res) => {
  users
    .findAll({
      where: { isLogged: 1 }
    })
    .then((models) => {
      const players = []
      models.forEach((model) => {
        players.push(model.realname)
      })
      shuffle(players)
      res.status(200).json({ players })
    })
    .catch((reason) => {
      console.log(reason)
      res.status(500).send('error')
    })
}
