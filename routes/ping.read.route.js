/* A simple ping test API */

export const controller = (req, res) => {
  res.status(200).send('pong')
}