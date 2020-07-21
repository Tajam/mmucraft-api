/**
 * get a random seed value from cache
 * request:
 * response:
 *   - seed: a random number ranged between 0 to 10000
 *   - status: 0 = cache available, 1 = cache replenished, 2 = failed to replenish cache
 */

import axios from 'axios'

const seeds = []

export const controller = (req, res) => {
  let status = 0
  if (seeds.length <= 0) {
    axios
      .get(
        'https://www.random.org/integers/?num=100&min=0&max=10000&col=1&base=10&format=plain&rnd=new'
      )
      .then((seedRes) => {
        status = 1
        seedRes.data.split('\n').forEach(number => {
          seeds.push(parseInt(number))
        })
        // get rid of the last null element
        seeds.pop()
      })
      .catch((reason) => {
        status = 2
        seeds.push(Math.round(Math.random() * 10000))
        console.log(reason.response.data)
      })
      .finally(() => {
        res.status(200).json({ seed: seeds.pop(), status })
      })
  } else {
    res.status(200).json({ seed: seeds.pop(), status })
  }
}

export const level = 2
