import { MAILS_TEMPLATES } from '../constants/constants.js'
import { GMAIL_MAIL_FROM } from '../constants/envVars.js'
import EErrors from '../errors/EErrors.js'
import ErrorService from './error.service.js'
import LoggerService from './logger.service.js'

export default class MailService {
  constructor(transporter) {
    this.transporter = transporter
  }

  sendMail = async ({ to, template }) => {
    try {
      if (!to)
        ErrorService.createError({
          message: 'No se ha especificado un destinatario',
          name: 'MailService Error',
          code: EErrors.INCOMPLETE_VALUES,
        })

      if (!template)
        ErrorService.createError({
          message: 'No se ha especificado una plantilla de mail',
          name: 'MailService Error',
          code: EErrors.INCOMPLETE_VALUES,
        })

      const { subject, html } = template

      await this.transporter.verify()
      const response = await this.transporter.sendMail({
        from: GMAIL_MAIL_FROM,
        to,
        subject,
        html,
      })

      LoggerService.info(`📨 Mail enviado a ${to}`)

      return response
    } catch (e) {
      LoggerService.error(e.message)
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

  sendRestorePasswordMail = async ({ to, token }) => {
    return await this.sendMail({
      to,
      template: MAILS_TEMPLATES.RESTORE_PASSWORD({ token }),
    })
  }
}
