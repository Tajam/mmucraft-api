/* read test */

export const controller = (req, res) => {
  res.status(200).json({ ping: 'update', response: req.body })
}
