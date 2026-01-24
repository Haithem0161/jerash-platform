import nodemailer from 'nodemailer'
import { config } from '../config/index.js'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter && config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    })
  }
  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transport = getTransporter()

  if (!transport) {
    console.warn('Email not configured, skipping send')
    return false
  }

  try {
    await transport.sendMail({
      from: config.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendContactNotification(submission: {
  name: string
  email: string
  phone?: string | null
  department: string
  message: string
}) {
  if (!config.ADMIN_EMAIL) return

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
    <p><strong>Department:</strong> ${submission.department}</p>
    <hr>
    <h3>Message:</h3>
    <p>${submission.message.replace(/\n/g, '<br>')}</p>
  `

  await sendEmail({
    to: config.ADMIN_EMAIL,
    subject: `[Jerash] New Contact: ${submission.name} - ${submission.department}`,
    html,
    text: `New contact from ${submission.name} (${submission.email}): ${submission.message}`,
  })
}

export async function sendApplicationNotification(application: {
  name: string
  email: string
  phone: string
  jobTitle?: string
  cvFilename: string
}) {
  if (!config.ADMIN_EMAIL) return

  const html = `
    <h2>New Job Application</h2>
    <p><strong>Name:</strong> ${application.name}</p>
    <p><strong>Email:</strong> ${application.email}</p>
    <p><strong>Phone:</strong> ${application.phone}</p>
    ${application.jobTitle ? `<p><strong>Position:</strong> ${application.jobTitle}</p>` : ''}
    <p><strong>CV:</strong> ${application.cvFilename}</p>
    <hr>
    <p>Please log in to the admin dashboard to review this application.</p>
  `

  await sendEmail({
    to: config.ADMIN_EMAIL,
    subject: `[Jerash] New Application: ${application.name}${application.jobTitle ? ` for ${application.jobTitle}` : ''}`,
    html,
    text: `New application from ${application.name} (${application.email})`,
  })
}
