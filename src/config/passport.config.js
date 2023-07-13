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

import { isValidPassword } from '../utils/bcrypt.js'
import { cookieExtractor } from '../utils/jwt.utils.js'
import logger from '../utils/logger.utils.js'
import { isUsersDataValid } from '../utils/validations/users.validation.util.js'
import { cartRepository, userRepository } from '../services/repositories/index.js'
import SessionUserDTO from '../dto/SessionUserDTO.js'

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

          const userExists = await userRepository.getUserByEmail(email)

          if (userExists) return done(null, false, { message: 'El email ya está registrado' })

          const newCart = await cartRepository.addCart()

          const user = await userRepository.addUser({
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
        const existUser = await userRepository.getUserByEmail(email)

        if (!existUser || !isValidPassword(password, existUser.password))
          return done(null, false, { message: 'Usuario o contraseña incorrectas' })

        const sessionUserDTO = new SessionUserDTO(existUser)

        return done(null, sessionUserDTO)
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
          const { name, email, login } = profile._json

          const emailGithub = email || login

          if (!name || !emailGithub) {
            logger.error('No se pudo obtener la información de GitHub', { emailGithub, name })
            return done(null, false, { message: 'No se pudo obtener la información de GitHub' })
          }

          const user = await userRepository.getUserByEmail(emailGithub)

          if (!user) {
            const newCart = await cartRepository.addCart()

            const newUser = {
              firstName: name,
              email: emailGithub,
              password: '',
              cart: newCart,
            }

            const result = await userRepository.addUser(newUser)

            const sessionUserDTO = new SessionUserDTO(result)

            return done(null, sessionUserDTO)
          }

          const sessionUserDTO = new SessionUserDTO(user)

          return done(null, sessionUserDTO)
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
        if (!payload) return done(null, payload)

        return done(null, new SessionUserDTO(payload))
      }
    )
  )
}

export default initializePassportStrategies
