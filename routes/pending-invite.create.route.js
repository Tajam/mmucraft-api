/**
 * create a pending record for certain purpose
 * request:
 *   - email: the email address
 *   - token: recaptcha response token
 * response:
 *   - status: 0 = success, 1 = invalid email domain, 2 = recaptcha failed, 3 = email exists, 4 = invite mail failed
 */

import { settings } from '../config.js'
import { models } from '../db.js'
import { verify } from '../utils/recaptcha.js'
import { invitationSendMail } from '../utils/mailer/index.js'
import sql from 'sequelize'
import Hashids from 'hashids'

const purpose = 'invite'
const { email_domain_whitelist } = settings
const { users, pending } = models
const { Op } = sql
const hashids = new Hashids(settings.master_key, 9)

export const controller = (req, res) => {
  const { token, email } = req.body
  if (!token || !email) {
    res.status(400).send('invalid usage')
    return
  }
  if (!email_domain_whitelist.some((domain) => email.endsWith(domain))) {
    res.status(200).json({ status: 1 })
    return
  }
  verify(token, (recaptcha_result) => {
    if (!recaptcha_result) {
      res.status(200).json({ status: 2 })
      return
    }
    users
      .findOne({
        where: { email: email }
      })
      .then((model) => {
        if (model) {
          res.status(200).json({ status: 3 })
          return
        }
        const hash = hashids.encode(Date.now())
        pending
          .findOrCreate({
            where: { [Op.and]: [{ email: email }, { purpose: purpose }] },
            defaults: {
              email: email,
              hash: hash,
              purpose: purpose
            }
          })
          .then(([model, created]) => {
            if (created) {
              invitationSendMail(hash, email, (sent) => {
                if (!sent) {
                  model.destroy()
                  res.status(200).json({ status: 4 })
                  return
                }
                res.status(200).json({ status: 0 })
              })
            } else {
              res.status(200).json({ status: 3 })
            }
          })
          .catch((reason) => {
            console.log(reason)
            res.status(500).send('error')
          })
      })
      .catch((reason) => {
        console.log(reason)
        res.status(500).send('error')
      })
  })
}
