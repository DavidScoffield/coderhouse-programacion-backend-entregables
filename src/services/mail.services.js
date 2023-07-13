import { MAILS_TEMPLATES } from '../constants/constants.js'
import { GMAIL_MAIL_FROM } from '../constants/envVars.js'
import loggerUtils from '../utils/logger.utils.js'

export default class MailService {
  constructor(transporter) {
    this.transporter = transporter
  }

  sendMail = async ({ to, template }) => {
    try {
      if (!to) throw new Error('No se ha especificado un destinatario')
      if (!template) throw new Error('No se ha especificado una plantilla de mail')

      const { subject, html } = template

      await this.transporter.verify()
      return await this.transporter.sendMail({
        from: GMAIL_MAIL_FROM,
        to,
        subject,
        html,
      })
    } catch (e) {
      loggerUtils.error(e.message)
    }
  }

  sendWelcomeMail = async ({ to, name }) => {
    return await this.sendMail({
      to,
      template: MAILS_TEMPLATES.WELCOME({ name }),
    })
  }

  sendPurchasedCartMail = async ({ to, name, ticket }) => {
    return await this.sendMail({
      to,
      template: MAILS_TEMPLATES.PURCHASED_CART({ name, ticket }),
    })
  }
}
