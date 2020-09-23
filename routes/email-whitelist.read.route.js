/**
 * get all whitelisted email domains
 * request:
 * response:
 *   - domains: a list of whitelisted email domains
 */

import { settings } from '../config.js'

export const controller = (req, res) => {
  try {
    const { email_domain_whitelist } = settings
    res.status(200).json({ domains: email_domain_whitelist })
  } catch (e) {
    console.log(e)
    res.status(500).send('error')
  }
}
