/**
 * create a pending record for certain purpose
 * request:
 *   - email: the email address
 *   - g-recaptcha-response: recaptcha response token
 * response:
 *   - status: 0 = success, 1 = email domain not acceptable, 2 = recaptcha failed, 3 = repeated email, 4 = failed
 */

import { settings } from '../config.js'
import { models } from '../db.js'
import { verify } from '../utils/recaptcha.js'
import { invitationSendMail } from '../utils/mailer'
import Hashids from 'hashids'

const purpose = 'invite'
const { email_domain_whitelist } = settings
const { users, pending } = models
const hashids = new Hashids(settings.master_key, 9)

export const controller = (req, res) => {
  const token = req.body['g-recaptcha-response']
  const { email } = req.body
  if (!token || !email) {
    res.status(400).send('invalid usage')
    return
  }
  if (!email_domain_whitelist.some((domain) => email.endsWith(domain))) {
    res.status(200).json({ status: 1 })
    return
  }
  if (!verify(token)) {
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
      const hash = hashids.encode(new Date.now())
      pending
        .findOrCreate({
          where: { email: email, purpose: purpose },
          defaults: {
            hash: hash,
            email: email,
            purpose: purpose
          }
        })
        .then(([model, created]) => {
          if (created) {
            invitationSendMail(hash, email, (sent) => {
              if (!sent) {
                res.status(200).json({ status: 4 })
                return
              }
              res.status(200).json({ status: 0 })
            })
          } else {
            res.status(200).json({ status: 3 })
          }
        })
    })
}
