import passport from 'passport'
import GithubStrategy from 'passport-github2'
import { Strategy as LocalStrategy } from 'passport-local'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'

import {
  ADMIN_USER,
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SECRET_JWT,
} from '../constants/envVars.js'
import { CM, UM } from '../constants/singletons.js'

import { isValidPassword } from '../utils/bcrypt.js'
import { cookieExtractor } from '../utils/jwt.utils.js'
import logger from '../utils/logger.utils.js'
import { isUsersDataValid } from '../utils/validations/users.validation.util.js'

const initializePassportStrategies = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, email, password, done) => {
        const { firstName, lastName, age } = req.body

        if (email === ADMIN_USER)
          return done(null, false, { message: 'No se puede registrar un usuario con ese email' })

        try {
          isUsersDataValid({ firstName, lastName, email, age, password })

          const userExists = await UM.getUserByEmail(email)

          if (userExists) return done(null, false, { message: 'El email ya está registrado' })

          const newCart = await CM.addCart()

          const user = await UM.addUser({
            firstName,
            lastName,
            age,
            email,
            password,
            cart: newCart,
          })

          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const existUser = await UM.getUserByEmail(email)

        if (!existUser || !isValidPassword(password, existUser.password))
          return done(null, false, { message: 'Usuario o contraseña incorrectas' })

        const user = {
          id: existUser._id,
          name: `${existUser.firstName} ${existUser.lastName}`,
          email: existUser.email,
          role: existUser.role,
        }
        return done(null, user)
      } catch (e) {
        done(e)
      }
    })
  )

  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json

          if (!name || !email) {
            logger.error('No se pudo obtener la información de GitHub', { email, name })
            return done(null, false, { message: 'No se pudo obtener la información de GitHub' })
          }

          const user = await UM.getUserByEmail(email)

          if (!user) {
            const newCart = await CM.addCart()

            const newUser = {
              firstName: name,
              email,
              password: '',
              cart: newCart,
            }
            const result = await UM.addUser(newUser)
            return done(null, result)
          }
          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_JWT,
      },
      async (payload, done) => {
        return done(null, payload)
      }
    )
  )
}

export default initializePassportStrategies
