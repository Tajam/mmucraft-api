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

export const settings = {
  port: process.env.PORT,
  prefix: process.env.PREFIX,
  master_key: process.env.MASTER_KEY
}
