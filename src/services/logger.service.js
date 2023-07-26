import { logger } from '../config/winston.config.js'

export default class LoggerService {
  static fatal(...params) {
    const arrayParams = [...params].join('\n')
    logger.fatal(arrayParams)
  }

  static error(...params) {
    const arrayParams = [...params].join('\n')
    logger.error(arrayParams)
  }

  static info(...params) {
    const arrayParams = [...params].join(' ')
    logger.info(arrayParams)
  }

  static warn(...params) {
    const arrayParams = [...params].join(' ')
    logger.warning(arrayParams)
  }

  static http(...params) {
    const arrayParams = [...params].join(' ')
    logger.http(arrayParams)
  }

  static debug(...params) {
    const arrayParams = [...params].join(' ')
    logger.debug(arrayParams)
  }
}
