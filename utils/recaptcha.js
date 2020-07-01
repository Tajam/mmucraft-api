import axios from 'axios'

const recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify'

export const verify = (token) => {
  return axios
    .post(recaptcha_url)
    .then((res) => {
      const { success, hostname } = res.data
      return success
    })
    .catch((reason) => {
      return false
    })
}