import type { EmailAdapter, SendEmailOptions } from 'payload'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { APIResponse } from 'mailersend/lib/services/request.service'

type MailerSendAdapter = EmailAdapter<APIResponse | undefined>

export type MailerSendAdapterArgs = {
  defaultFromAddress: string
  defaultFromName: string
}

/**
 * Email adapter for [MailerSend](https://resend.com) REST API
 */
export const mailerSendAdapter = (args: MailerSendAdapterArgs): MailerSendAdapter => {
  const { defaultFromAddress, defaultFromName } = args

  const adapter: MailerSendAdapter = () => ({
    name: 'mailer-send-rest',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY || '',
      })

      const sender = mapSender(message.from, defaultFromName, defaultFromAddress)
      if (sender) {
        const recipients = mapRecipients(message.to)

        const emailParams = new EmailParams()
          .setFrom(sender)
          .setTo(recipients)
          .setSubject(message.subject ?? '')
          .setHtml(message.html?.toString() || '')
          .setText(message.text?.toString() || '')

        return await mailerSend.email.send(emailParams)
      }
    },
  })

  return adapter
}

function mapSender(
  from: SendEmailOptions['from'],
  defaultFromName: string,
  defaultFromAddress: string,
): Sender | undefined {
  if (!from) {
    return new Sender(defaultFromAddress, defaultFromName)
  } else {
    if (typeof from === 'string') {
      const match = from.match(/^"([^"]*)" <([^>]*)>$/)
      if (match) {
        return new Sender(match[2], match[1])
      }
    } else {
      return new Sender(from.address, from.name)
    }
  }
}

function mapRecipients(recipients: SendEmailOptions['to']): Recipient[] {
  if (!recipients) {
    return []
  }

  if (typeof recipients === 'string') {
    return [new Recipient(recipients)]
  }

  if (Array.isArray(recipients)) {
    return recipients.map((recipient) =>
      typeof recipient === 'string' ? new Recipient(recipient) : new Recipient(recipient.address),
    )
  }

  return [new Recipient(recipients.address)]
}
