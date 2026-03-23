'use server'

import { createTransport } from 'nodemailer'

const SERVER = process.env.SMTP_SERVER
const PORT = process.env.SMTP_PORT
const USER = process.env.EMAIL_USER
const PASS = process.env.EMAIL_PASSWORD

function getSMTPConnection() {
  if (!SERVER || !PORT || !USER || !PASS) {
    throw new Error('Missing environment variables')
  }

  return createTransport({
    host: SERVER,
    port: +PORT,
    secure: true,
    auth: {
      user: USER,
      pass: PASS,
    },
  })
}

export async function sendEmail(to: string, subject: string, body: string) {
  const transporter = getSMTPConnection()

  const mailOptions = {
    from: USER,
    to,
    subject,
    html: body,
  }

  try {
    await transporter.sendMail(mailOptions)

    transporter.close()

  } catch { }
}

export async function sendAuthCode(to: string, code: string) {
  await sendEmail(to, 'EBD - Código de acesso', `<p>Seu código de acesso é: ${code}</p>`)
}