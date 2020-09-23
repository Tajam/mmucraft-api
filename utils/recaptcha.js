import axios from 'axios'
import { settings }from '../config.js'

const recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify'

export const verify = (token, callback) => {
  return axios
    .post(`${recaptcha_url}?secret=${settings.recaptcha_key}&response=${token}`)
    .then((res) => {
      const { success, hostname } = res.data
      callback(settings.host_name.split(':')[0] == hostname ? success : false)
    })
    .catch((reason) => {
      console.log(reason)
      callback(false)
    })
}
