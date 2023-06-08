import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UM } from '../constants/singletons.js'
import { isUsersDataValid } from '../utils/validations/users.validation.util.js'
import { isValidPassword } from '../utils/bcrypt.js'
import { ADMIN_USER } from '../constants/envVars.js'
import { DEFAULT_ADMIN_DATA } from '../constants/constants.js'

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

          const user = await UM.addUser({ firstName, lastName, age, email, password })

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

  // passport.use(
  //   'github',
  //   new GithubStrategy(
  //     {
  //       clientID: 'Iv1.b55c6ef14ccd0d08',
  //       clientSecret: '5effb2e147aab7053a213c6d57fe02b057c714c9',
  //       callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         console.log(profile);
  //         //Tomo los datos que me sirvan.
  //         const { name, email } = profile._json;
  //         const user = await userModel.findOne({ email });
  //         //DEBO GESTIONAR AMBAS LÓGICAS AQUÍ, OMG!!!
  //         if(!user) {
  //           //No existe? lo creo entonces.
  //           const newUser =  {
  //             first_name: name,
  //             email,
  //             password:''
  //           }
  //           const result = await userModel.create(newUser);
  //           done(null,result);
  //         }
  //         //Si el usuario ya existía, Qué mejor!!!
  //         done(null,user);
  //       } catch (error) {
  //         done(error);
  //       }
  //     }
  //   )
  // );

  passport.serializeUser(function (user, done) {
    return done(null, user.id)
  })
  passport.deserializeUser(async function (id, done) {
    if (id === DEFAULT_ADMIN_DATA.id) {
      return done(null, {
        ...DEFAULT_ADMIN_DATA,
      })
    }
    const user = await UM.getUserById(id)
    return done(null, user)
  })
}

export default initializePassportStrategies
