import { mail, settings } from '../../config.js'
import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import fs from 'fs'

const templates = {}
fs
  .readdirSync('./utils/mailer/template')
  .filter(file => file.endsWith('.email'))
  .map(async file => {
    const name = file.split('.')[0]
    const html = fs.readFileSync(`./utils/mailer/template/${file}`, 'utf8')
    templates[name] = html
  })

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: mail.user,
    pass: mail.pass
  }
})

const email = (receiver, type, context, callback) => {
  context.year = new Date().getFullYear()
  const template = templates[type]
  const templateScript = Handlebars.compile(template)
  const html = templateScript(context)
  const message = {
    from: 'MMUC',
    to: receiver,
    subject: subject,
    html: html
  }
  transporter.sendMail(message, (error) => {
    callback(!error)
  })
}

export const invitationSendMail = (token, receiver, callback) => {
  const context = {
    link: `${settings.domain_name}/register/${token}`
  }
  email(receiver, 'invitation', content, callback)
}

export const passwordSendMail = (token, receiver, callback) => {
  const context = {
    linkReset: `${settings.host_url}password-reset/${token}`,
    linkCancel: `${settings.host_url}reset-cancel/${token}`
  }
  email(receiver, 'password', content, callback)
}