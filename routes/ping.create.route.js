/* read test */

export const controller = (req, res) => {
  res.status(200).json({ ping: 'create', response: req.body })
}
