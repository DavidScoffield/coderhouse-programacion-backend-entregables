import LoggerService from '../services/logger.service.js'

const log = (req, res) => {
  LoggerService.fatal('faltal de prueba')
  LoggerService.error('error de prueba')
  LoggerService.info('info de prueba')
  LoggerService.warn('warn de prueba')
  LoggerService.http('http de prueba')
  LoggerService.debug('debug de prueba')

  res.sendStatus(200)
}

export default { log }
