import swaggerJSDoc from 'swagger-jsdoc'
import { __root } from '../utils/dirname.utils.js'

const swaggerInit = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API CoderHouse',
      version: '1.0.0',
      description:
        'Documentación de la API de CoderHouse para el proyecto final del curso de Backend.',
    },
  },
  apis: [`${__root}/docs/**/*.yml`],
}

export const swaggerSpecs = swaggerJSDoc(swaggerInit)

export const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Ecommerce API Docs',
  customCss: '.swagger-ui .topbar a { display: none }',
  isExplorer: true,
  filter: true,
  customfavIcon: '/favicon.ico',
}

export const swaggerOptions = { withCredentials: true }
