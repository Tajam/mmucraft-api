import { mail, settings } from '../../config.js'
import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import fs from 'fs'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: mail.user,
    pass: mail.pass
  }
})

const email = (receiver, subject, context, callback) => {
  context.sponsor = `Powered by IT Society @${new Date().getFullYear()}`
  const template = fs.readFileSync(`./utils/mailer/template.handlebars`, 'utf8')
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
    title: "Welcome to MMUC!",
    contents: [
      { text: "Hi new crafter,", colour: "#FFFFFF" },
      { text: "We welcome you to join our minecraft server hosted by ITS, Cyberjaya. Click the button below now to register a new account. Enjoy!", colour: "#FFFFFF" }
    ],
    buttons: [
      { text: "Register", href: `${settings.host_name}/register/${token}`, colour: "#48C9B0" }
    ],
    background: 'https://i.pinimg.com/originals/3f/f0/b1/3ff0b1dcf3708d8c8d5cfd80f57ab8b1.gif'
  }
  email(receiver, 'Welcome to MMUC Network!', context, callback)
}

export const passwordResetSendMail = (token, receiver, callback) => {
  const context = {
    title: "Password Reset Request",
    contents: [
      { text: "Forget password? Worry not, we got your back!", colour: "#FFFFFF" },
      { text: "Click the 'reset' button below to make a new password.", colour: "#FFFFFF" },
      { text: "If you did not make this request please click on the cancel button!", colour: "#ff7575" }
    ],
    buttons: [
      { text: "Reset", href: `${settings.host_name}/password-reset/${token}`, colour: "#48C9B0" },
      { text: "Cancel", href: `${settings.host_name}/password-reset/cancel/${token}`, colour: "#800000" }
    ],
    background: 'https://i.pinimg.com/originals/3f/f0/b1/3ff0b1dcf3708d8c8d5cfd80f57ab8b1.gif'
  }
  email(receiver, 'Password Reset Request', context, callback)
}

export const passwordNewSendMail = (password, receiver, callback) => {
  const context = {
    title: "Password Reset Notice",
    contents: [
      { text: "An admin has reset your password.", colour: "#FFFFFF" },
      { text: `The new password is: ${password}`, colour: "#FFFFFF" },
      { text: "Please change the password as soon as you logged in!", colour: "#ff7575" }
    ],
    background: 'https://i.pinimg.com/originals/3f/f0/b1/3ff0b1dcf3708d8c8d5cfd80f57ab8b1.gif'
  }
  email(receiver, 'Password Reset Notice', context, callback)
}