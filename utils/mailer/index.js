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

const email = (receiver, type, subject, context, callback) => {
  context.year = new Date().getFullYear()
  const template = templates[type]
  const templateScript = Handlebars.compile(template)
  const html = templateScript(context)
  const message = {
    from: 'MMUC Network',
    to: receiver,
    subject,
    html: html
  }
  transporter.sendMail(message, (error) => {
    callback(!error)
  })
}

export const invitationSendMail = (token, receiver, callback) => {
  const context = {
    link: `${settings.host_name}/register/${token}`
  }
  email(receiver, 'invitation', 'Welcome to MMUC Network!', context, callback)
}

export const passwordSendMail = (token, receiver, callback) => {
  const context = {
    linkReset: `${settings.host_name}/password-reset/${token}`,
    linkCancel: `${settings.host_name}/reset-cancel/${token}`
  }
  email(receiver, 'password', 'MMUC Network Password Reset', context, callback)
}