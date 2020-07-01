import dotenv from 'dotenv';

dotenv.config();

export const db = {
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  host: process.env.DB_HOST,
  logs: process.env.DB_LOGS
}

export const mail = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS
}

export const server_port = {
  lobby: process.env.SERVER_LOBBY,
  survival: process.env.SERVER_SURVIVAL,
  creative: process.env.SERVER_CREATIVE,
  civil: process.env.SERVER_CIVIL
}

export const settings = {
  port: process.env.PORT,
  prefix: process.env.PREFIX,
  host_url: process.env.HOST_URL,
  master_key: process.env.MASTER_KEY,
  email_domain_whitelist: [
    '@gmail.com',
    '@student.mmu.edu.my',
    '@mmu.edu.my'
  ]
}
