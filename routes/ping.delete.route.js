/* read test */

export const controller = (req, res) => {
  res.status(200).json({ ping: 'delete', response: req.body })
}
